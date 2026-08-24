import { Injectable } from '@nestjs/common';
import {
  MetodoPago,
  Prisma,
  MovimientoInventario as MovimientoPrisma,
  Producto as ProductoPrisma,
} from '@prisma/client';
import { ConflictError, NotFoundError } from '../../shared/domain/errors';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import { MovimientoInventario } from '../domain/movimiento-inventario.entity';
import { Producto } from '../domain/producto.entity';
import {
  InventarioTransaccionPort,
  RegistrarAjusteDatos,
  RegistrarCompraDatos,
  RegistrarPerdidaDatos,
  ResultadoMovimiento,
} from '../application/ports/inventario-transaccion.port';

type ClientePrisma = Prisma.TransactionClient;

@Injectable()
export class InventarioTransaccionPrisma implements InventarioTransaccionPort {
  constructor(private readonly prisma: PrismaService) {}

  async registrarCompra(datos: RegistrarCompraDatos): Promise<ResultadoMovimiento> {
    return this.prisma.$transaction(async (tx) => {
      const producto = await tx.producto.findUnique({ where: { id: datos.productoId } });
      if (!producto) {
        throw new NotFoundError('Producto no encontrado');
      }

      if (datos.fuentePago === 'EFECTIVO_CAJA') {
        const cajaAbierta = await tx.caja.findFirst({ where: { estado: 'ABIERTA' } });
        if (!cajaAbierta) {
          throw new ConflictError(
            'No hay caja abierta, debe abrir caja antes de registrar una compra en efectivo de caja',
          );
        }
      }

      // costoUnitario es opcional (productos como copias o servicios pueden no
      // tener un costo de adquisición real) — sin costo, la compra solo suma
      // stock y no genera ningún movimiento de dinero.
      const costoUnitario = datos.costoUnitario ?? 0;
      const montoTotal = Math.round(costoUnitario * datos.cantidad * 100) / 100;

      if (montoTotal > 0 && datos.fuentePago === 'FONDO_GENERAL' && !datos.moneda) {
        throw new Error(
          'Debe indicar la moneda (EFECTIVO o TRANSFERENCIA) cuando la compra se paga desde el Fondo General',
        );
      }

      const gasto = await tx.gasto.create({
        data: {
          usuarioId: datos.usuarioId,
          descripcion: `Compra de ${datos.cantidad} unidad(es) de ${producto.nombre}`,
          monto: montoTotal,
          categoria: 'Compra de productos',
          fuentePago: datos.fuentePago,
          moneda: datos.fuentePago === 'FONDO_GENERAL' && montoTotal > 0 ? datos.moneda : null,
          generadoAutomaticamente: true,
        },
      });

      if (montoTotal > 0 && datos.fuentePago === 'FONDO_GENERAL') {
        const moneda = datos.moneda!;
        const saldoActualizado = await this.decrementarSaldoGlobalOFallar(tx, moneda, montoTotal);

        await tx.movimientoFondoGeneral.create({
          data: {
            usuarioId: datos.usuarioId,
            tipo: 'GASTO',
            monto: montoTotal,
            metodoPago: moneda,
            saldoResultanteEfectivo: saldoActualizado.saldoEfectivo,
            saldoResultanteTransferencia: saldoActualizado.saldoTransferencia,
            referenciaId: gasto.id,
            descripcion: gasto.descripcion,
          },
        });
      }

      const movimiento = new MovimientoInventario(
        crypto.randomUUID(),
        datos.productoId,
        datos.usuarioId,
        'COMPRA',
        datos.cantidad,
        null,
        gasto.id,
        new Date(),
      );

      const movimientoCreado = await tx.movimientoInventario.create({
        data: {
          id: movimiento.id,
          productoId: movimiento.productoId,
          usuarioId: movimiento.usuarioId,
          tipo: movimiento.tipo,
          cantidad: movimiento.cantidad,
          gastoId: movimiento.gastoId,
          fecha: movimiento.fecha,
        },
      });

      const productoActualizado = await tx.producto.update({
        where: { id: datos.productoId },
        data: {
          stockActual: { increment: datos.cantidad },
          costoUnitario: datos.costoUnitario,
        },
      });

      return {
        movimiento: this.movimientoADominio(movimientoCreado),
        producto: this.productoADominio(productoActualizado),
      };
    });
  }

  async registrarPerdida(datos: RegistrarPerdidaDatos): Promise<ResultadoMovimiento> {
    return this.prisma.$transaction(async (tx) => {
      await this.decrementarStockOFallar(tx, datos.productoId, datos.cantidad, 'la pérdida');

      const movimiento = new MovimientoInventario(
        crypto.randomUUID(),
        datos.productoId,
        datos.usuarioId,
        'PERDIDA',
        datos.cantidad,
        datos.motivo,
        null,
        new Date(),
      );

      const movimientoCreado = await tx.movimientoInventario.create({
        data: {
          id: movimiento.id,
          productoId: movimiento.productoId,
          usuarioId: movimiento.usuarioId,
          tipo: movimiento.tipo,
          cantidad: movimiento.cantidad,
          motivo: movimiento.motivo,
          fecha: movimiento.fecha,
        },
      });

      const producto = await tx.producto.findUniqueOrThrow({ where: { id: datos.productoId } });

      return {
        movimiento: this.movimientoADominio(movimientoCreado),
        producto: this.productoADominio(producto),
      };
    });
  }

  async registrarAjuste(datos: RegistrarAjusteDatos): Promise<ResultadoMovimiento> {
    return this.prisma.$transaction(async (tx) => {
      if (datos.direccion === 'DECREMENTO') {
        await this.decrementarStockOFallar(tx, datos.productoId, datos.cantidad, 'el ajuste');
      } else {
        const producto = await tx.producto.findUnique({ where: { id: datos.productoId } });
        if (!producto) {
          throw new NotFoundError('Producto no encontrado');
        }
        await tx.producto.update({
          where: { id: datos.productoId },
          data: { stockActual: { increment: datos.cantidad } },
        });
      }

      const movimiento = new MovimientoInventario(
        crypto.randomUUID(),
        datos.productoId,
        datos.usuarioId,
        'AJUSTE',
        datos.cantidad,
        datos.motivo ?? null,
        null,
        new Date(),
      );

      const movimientoCreado = await tx.movimientoInventario.create({
        data: {
          id: movimiento.id,
          productoId: movimiento.productoId,
          usuarioId: movimiento.usuarioId,
          tipo: movimiento.tipo,
          cantidad: movimiento.cantidad,
          motivo: movimiento.motivo,
          fecha: movimiento.fecha,
        },
      });

      const producto = await tx.producto.findUniqueOrThrow({ where: { id: datos.productoId } });

      return {
        movimiento: this.movimientoADominio(movimientoCreado),
        producto: this.productoADominio(producto),
      };
    });
  }

  private async decrementarStockOFallar(
    tx: ClientePrisma,
    productoId: string,
    cantidad: number,
    etiqueta: string,
  ): Promise<void> {
    const producto = await tx.producto.findUnique({ where: { id: productoId } });
    if (!producto) {
      throw new NotFoundError('Producto no encontrado');
    }

    const resultado = await tx.producto.updateMany({
      where: { id: productoId, stockActual: { gte: cantidad } },
      data: { stockActual: { decrement: cantidad } },
    });

    if (resultado.count === 0) {
      throw new ConflictError(`Stock insuficiente para registrar ${etiqueta}`);
    }
  }

  private async decrementarSaldoGlobalOFallar(
    tx: ClientePrisma,
    moneda: MetodoPago,
    monto: number,
  ) {
    const resultado = await tx.saldoGlobal.updateMany({
      where: {
        id: 1,
        ...(moneda === 'EFECTIVO'
          ? { saldoEfectivo: { gte: monto } }
          : { saldoTransferencia: { gte: monto } }),
      },
      data:
        moneda === 'EFECTIVO'
          ? { saldoEfectivo: { decrement: monto } }
          : { saldoTransferencia: { decrement: monto } },
    });

    if (resultado.count === 0) {
      throw new ConflictError(
        `Saldo insuficiente en Fondo General [${moneda === 'EFECTIVO' ? 'efectivo' : 'transferencia'}]`,
      );
    }

    return tx.saldoGlobal.findUniqueOrThrow({ where: { id: 1 } });
  }

  private productoADominio(registro: ProductoPrisma): Producto {
    return new Producto(
      registro.id,
      registro.nombre,
      registro.costoUnitario.toNumber(),
      registro.precioVenta.toNumber(),
      registro.stockActual,
      registro.activo,
      registro.createdAt,
      registro.cobraPorTiempo,
      registro.tarifaPorHora ? registro.tarifaPorHora.toNumber() : null,
    );
  }

  private movimientoADominio(registro: MovimientoPrisma): MovimientoInventario {
    return new MovimientoInventario(
      registro.id,
      registro.productoId,
      registro.usuarioId,
      registro.tipo,
      registro.cantidad,
      registro.motivo,
      registro.gastoId,
      registro.fecha,
    );
  }
}
