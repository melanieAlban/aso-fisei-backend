import { Injectable } from '@nestjs/common';
import {
  ArqueoCaja as ArqueoCajaPrisma,
  Caja as CajaPrisma,
  DetalleVenta as DetallePrisma,
  MovimientoFondoGeneral as MovimientoPrisma,
  Prisma,
  Venta as VentaPrisma,
} from '@prisma/client';
import { ConflictError, NotFoundError } from '../../shared/domain/errors';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import { ArqueoCaja } from '../domain/arqueo-caja.entity';
import { Caja } from '../domain/caja.entity';
import { DetalleVenta } from '../domain/detalle-venta.entity';
import { MovimientoFondoGeneral } from '../domain/movimiento-fondo-general.entity';
import { Venta } from '../domain/venta.entity';
import { VentaConDetalle } from '../domain/venta.repository';
import {
  AbrirCajaDatos,
  AjustarSaldoInicialDatos,
  AjusteFondoResultado,
  AnularItemVentaDatos,
  CajaTransaccionPort,
  LineaVentaDatos,
  RealizarArqueoDatos,
  RegistrarVentaDatos,
} from '../application/ports/caja-transaccion.port';

type ClientePrisma = Prisma.TransactionClient;

@Injectable()
export class CajaTransaccionPrisma implements CajaTransaccionPort {
  constructor(private readonly prisma: PrismaService) {}

  async abrirCaja(datos: AbrirCajaDatos): Promise<Caja> {
    return this.prisma.$transaction(async (tx) => {
      const existente = await tx.caja.findFirst({ where: { estado: 'ABIERTA' } });
      if (existente) {
        throw new ConflictError(
          'Ya existe una caja abierta. Debe realizar el arqueo antes de abrir una nueva.',
        );
      }

      const creada = await tx.caja.create({
        data: {
          usuarioAperturaId: datos.usuarioId,
          fondoInicialEfectivo: datos.fondoInicialEfectivo,
          estado: 'ABIERTA',
        },
      });

      return this.cajaADominio(creada);
    });
  }

  async registrarVenta(datos: RegistrarVentaDatos): Promise<VentaConDetalle> {
    return this.prisma.$transaction(async (tx) => {
      const cajaAbierta = await tx.caja.findFirst({ where: { estado: 'ABIERTA' } });
      if (!cajaAbierta) {
        throw new ConflictError('No hay caja abierta, debe abrir caja antes de vender');
      }

      const lineasConProducto: Array<{
        linea: (typeof datos.lineas)[number];
        producto: Prisma.ProductoGetPayload<Record<string, never>>;
        precioUnitario: number;
      }> = [];
      for (const linea of datos.lineas) {
        const producto = await tx.producto.findUnique({ where: { id: linea.productoId } });
        if (!producto) {
          throw new NotFoundError(`Producto no encontrado: ${linea.productoId}`);
        }
        lineasConProducto.push({
          linea,
          producto,
          precioUnitario: this.calcularPrecioUnitario(producto, linea),
        });
      }

      // El stock de productos que cobran por tiempo (ej. mesa de billar) no representa
      // unidades físicas limitadas — es un servicio. Se sigue descontando igual que
      // cualquier producto porque el flujo de venta lo requiere, pero se recomienda
      // mantener su stock alto vía un ajuste manual de inventario, como ya se hace hoy.
      for (const { linea, producto } of lineasConProducto) {
        const resultado = await tx.producto.updateMany({
          where: { id: linea.productoId, stockActual: { gte: linea.cantidad } },
          data: { stockActual: { decrement: linea.cantidad } },
        });
        if (resultado.count === 0) {
          throw new ConflictError(`Stock insuficiente para el producto "${producto.nombre}"`);
        }
      }

      const total = lineasConProducto.reduce(
        (acumulado, { linea, precioUnitario }) => acumulado + linea.cantidad * precioUnitario,
        0,
      );

      const ventaCreada = await tx.venta.create({
        data: {
          usuarioId: datos.usuarioId,
          cajaId: cajaAbierta.id,
          metodoPago: datos.metodoPago,
          total,
        },
      });

      const detallesCreados: DetallePrisma[] = [];
      for (const { linea, precioUnitario } of lineasConProducto) {
        const detalle = await tx.detalleVenta.create({
          data: {
            ventaId: ventaCreada.id,
            productoId: linea.productoId,
            cantidad: linea.cantidad,
            precioUnitario,
            esAlquiler: linea.esAlquiler ?? false,
            estadoAlquiler: linea.esAlquiler ? (linea.estadoAlquiler ?? 'PENDIENTE') : null,
            duracionMinutos: linea.duracionMinutos ?? null,
          },
        });
        detallesCreados.push(detalle);
      }

      return {
        venta: this.ventaADominio(ventaCreada),
        detalles: detallesCreados.map((detalle) => this.detalleADominio(detalle)),
      };
    });
  }

  private calcularPrecioUnitario(
    producto: Prisma.ProductoGetPayload<Record<string, never>>,
    linea: LineaVentaDatos,
  ): number {
    if (!producto.cobraPorTiempo) {
      return producto.precioVenta.toNumber();
    }

    if (!linea.duracionMinutos || linea.duracionMinutos <= 0) {
      throw new Error(
        `El producto "${producto.nombre}" cobra por tiempo: debe indicar duracionMinutos (entero positivo)`,
      );
    }

    const tarifaPorHora = producto.tarifaPorHora?.toNumber() ?? 0;
    return this.redondearDosDecimales(tarifaPorHora * (linea.duracionMinutos / 60));
  }

  private redondearDosDecimales(valor: number): number {
    return Math.round((valor + Number.EPSILON) * 100) / 100;
  }

  async anularItemVenta(datos: AnularItemVentaDatos): Promise<DetalleVenta> {
    return this.prisma.$transaction(async (tx) => {
      const detalle = await tx.detalleVenta.findUnique({ where: { id: datos.itemId } });
      if (!detalle || detalle.ventaId !== datos.ventaId) {
        throw new NotFoundError('Ítem de venta no encontrado');
      }
      if (detalle.estado === 'ANULADO') {
        throw new ConflictError('El ítem ya se encuentra anulado');
      }

      const detalleActualizado = await tx.detalleVenta.update({
        where: { id: datos.itemId },
        data: {
          estado: 'ANULADO',
          motivoAnulacion: datos.motivo,
          usuarioAnulacionId: datos.usuarioId,
        },
      });

      await tx.producto.update({
        where: { id: detalle.productoId },
        data: { stockActual: { increment: detalle.cantidad } },
      });

      return this.detalleADominio(detalleActualizado);
    });
  }

  async realizarArqueo(datos: RealizarArqueoDatos): Promise<ArqueoCaja> {
    return this.prisma.$transaction(
      async (tx) => {
        const caja = await tx.caja.findUnique({ where: { id: datos.cajaId } });
        if (!caja) {
          throw new NotFoundError('Caja no encontrada');
        }
        if (caja.estado !== 'ABIERTA') {
          throw new ConflictError('La caja ya se encuentra cerrada');
        }

        const ahora = new Date();

        const detallesEfectivo = await tx.detalleVenta.findMany({
          where: { estado: 'ACTIVO', venta: { cajaId: caja.id, metodoPago: 'EFECTIVO' } },
          select: { cantidad: true, precioUnitario: true },
        });
        const totalVentasEfectivo = detallesEfectivo.reduce(
          (acumulado, detalle) => acumulado + detalle.cantidad * detalle.precioUnitario.toNumber(),
          0,
        );

        const detallesTransferencia = await tx.detalleVenta.findMany({
          where: { estado: 'ACTIVO', venta: { cajaId: caja.id, metodoPago: 'TRANSFERENCIA' } },
          select: { cantidad: true, precioUnitario: true },
        });
        const totalVentasTransferencia = detallesTransferencia.reduce(
          (acumulado, detalle) => acumulado + detalle.cantidad * detalle.precioUnitario.toNumber(),
          0,
        );

        const gastosEfectivo = await tx.gasto.aggregate({
          where: {
            fuentePago: 'EFECTIVO_CAJA',
            estado: 'ACTIVO',
            fecha: { gte: caja.fechaApertura, lte: ahora },
          },
          _sum: { monto: true },
        });
        const totalGastosEfectivo = gastosEfectivo._sum.monto?.toNumber() ?? 0;

        const efectivoEsperado = caja.fondoInicialEfectivo.toNumber() + totalVentasEfectivo - totalGastosEfectivo;
        const transferenciaEsperado = totalVentasTransferencia;

        const arqueoCreado = await tx.arqueoCaja.create({
          data: {
            cajaId: caja.id,
            usuarioId: datos.usuarioId,
            efectivoEsperado,
            efectivoContado: datos.efectivoContado,
            transferenciaEsperado,
            transferenciaContado: datos.transferenciaContado,
            montoRetiradoEfectivo: datos.montoRetiradoEfectivo,
            montoRetiradoTransferencia: datos.montoRetiradoTransferencia,
            montoDejadoFondoCambio: datos.montoDejadoFondoCambio,
            clasificacionDiferencia: null,
          },
        });

        await tx.caja.update({
          where: { id: caja.id },
          data: { estado: 'CERRADA', usuarioCierreId: datos.usuarioId, fechaCierre: ahora },
        });

        if (datos.montoRetiradoEfectivo > 0) {
          const saldo = await this.aplicarDeltaSaldo(tx, datos.montoRetiradoEfectivo, 0);
          await tx.movimientoFondoGeneral.create({
            data: {
              usuarioId: datos.usuarioId,
              tipo: 'RETIRO_CAJA',
              monto: datos.montoRetiradoEfectivo,
              metodoPago: 'EFECTIVO',
              saldoResultanteEfectivo: saldo.saldoEfectivo,
              saldoResultanteTransferencia: saldo.saldoTransferencia,
              referenciaId: arqueoCreado.id,
              descripcion: `Retiro de caja (arqueo ${arqueoCreado.id})`,
            },
          });
        }

        if (datos.montoRetiradoTransferencia > 0) {
          const saldo = await this.aplicarDeltaSaldo(tx, 0, datos.montoRetiradoTransferencia);
          await tx.movimientoFondoGeneral.create({
            data: {
              usuarioId: datos.usuarioId,
              tipo: 'RETIRO_CAJA',
              monto: datos.montoRetiradoTransferencia,
              metodoPago: 'TRANSFERENCIA',
              saldoResultanteEfectivo: saldo.saldoEfectivo,
              saldoResultanteTransferencia: saldo.saldoTransferencia,
              referenciaId: arqueoCreado.id,
              descripcion: `Retiro de caja (arqueo ${arqueoCreado.id})`,
            },
          });
        }

        return this.arqueoADominio(arqueoCreado);
      },
      { timeout: 15000 },
    );
  }

  async ajustarSaldoInicialFondo(datos: AjustarSaldoInicialDatos): Promise<AjusteFondoResultado> {
    return this.prisma.$transaction(async (tx) => {
      const movimientos: MovimientoPrisma[] = [];
      let saldoFinal = { saldoEfectivo: 0, saldoTransferencia: 0 };

      if (datos.montoEfectivo !== 0) {
        saldoFinal = await this.aplicarDeltaSaldo(tx, datos.montoEfectivo, 0);
        const movimiento = await tx.movimientoFondoGeneral.create({
          data: {
            usuarioId: datos.usuarioId,
            tipo: 'AJUSTE_INICIAL',
            monto: datos.montoEfectivo,
            metodoPago: 'EFECTIVO',
            saldoResultanteEfectivo: saldoFinal.saldoEfectivo,
            saldoResultanteTransferencia: saldoFinal.saldoTransferencia,
            descripcion: datos.justificacion,
          },
        });
        movimientos.push(movimiento);
      }

      if (datos.montoTransferencia !== 0) {
        saldoFinal = await this.aplicarDeltaSaldo(tx, 0, datos.montoTransferencia);
        const movimiento = await tx.movimientoFondoGeneral.create({
          data: {
            usuarioId: datos.usuarioId,
            tipo: 'AJUSTE_INICIAL',
            monto: datos.montoTransferencia,
            metodoPago: 'TRANSFERENCIA',
            saldoResultanteEfectivo: saldoFinal.saldoEfectivo,
            saldoResultanteTransferencia: saldoFinal.saldoTransferencia,
            descripcion: datos.justificacion,
          },
        });
        movimientos.push(movimiento);
      }

      if (movimientos.length === 0) {
        throw new Error('Debe especificar al menos un monto distinto de cero');
      }

      return {
        movimientos: movimientos.map((movimiento) => this.movimientoADominio(movimiento)),
        saldoEfectivo: saldoFinal.saldoEfectivo,
        saldoTransferencia: saldoFinal.saldoTransferencia,
      };
    });
  }

  private async aplicarDeltaSaldo(
    tx: ClientePrisma,
    deltaEfectivo: number,
    deltaTransferencia: number,
  ): Promise<{ saldoEfectivo: number; saldoTransferencia: number }> {
    const actualizado = await tx.saldoGlobal.update({
      where: { id: 1 },
      data: {
        saldoEfectivo: { increment: deltaEfectivo },
        saldoTransferencia: { increment: deltaTransferencia },
      },
    });

    return {
      saldoEfectivo: actualizado.saldoEfectivo.toNumber(),
      saldoTransferencia: actualizado.saldoTransferencia.toNumber(),
    };
  }

  private cajaADominio(registro: CajaPrisma): Caja {
    return new Caja(
      registro.id,
      registro.usuarioAperturaId,
      registro.usuarioCierreId,
      registro.fondoInicialEfectivo.toNumber(),
      registro.estado,
      registro.fechaApertura,
      registro.fechaCierre,
    );
  }

  private arqueoADominio(registro: ArqueoCajaPrisma): ArqueoCaja {
    return new ArqueoCaja(
      registro.id,
      registro.cajaId,
      registro.usuarioId,
      registro.efectivoEsperado.toNumber(),
      registro.efectivoContado.toNumber(),
      registro.transferenciaEsperado.toNumber(),
      registro.transferenciaContado.toNumber(),
      registro.montoRetiradoEfectivo.toNumber(),
      registro.montoRetiradoTransferencia.toNumber(),
      registro.montoDejadoFondoCambio.toNumber(),
      registro.clasificacionDiferencia,
      registro.fecha,
    );
  }

  private ventaADominio(registro: VentaPrisma): Venta {
    return new Venta(
      registro.id,
      registro.usuarioId,
      registro.cajaId,
      registro.metodoPago,
      registro.total.toNumber(),
      registro.fecha,
    );
  }

  private detalleADominio(registro: DetallePrisma): DetalleVenta {
    return new DetalleVenta(
      registro.id,
      registro.ventaId,
      registro.productoId,
      registro.cantidad,
      registro.precioUnitario.toNumber(),
      registro.esAlquiler,
      registro.estadoAlquiler,
      registro.estado,
      registro.motivoAnulacion,
      registro.usuarioAnulacionId,
      registro.duracionMinutos,
    );
  }

  private movimientoADominio(registro: MovimientoPrisma): MovimientoFondoGeneral {
    return new MovimientoFondoGeneral(
      registro.id,
      registro.usuarioId,
      registro.tipo,
      registro.monto.toNumber(),
      registro.metodoPago,
      registro.saldoResultanteEfectivo.toNumber(),
      registro.saldoResultanteTransferencia.toNumber(),
      registro.referenciaId,
      registro.descripcion,
      registro.fecha,
    );
  }
}
