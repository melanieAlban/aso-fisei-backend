import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';

const CLAVE_STOCK_MINIMO_GLOBAL = 'stock_minimo_global';
const STOCK_MINIMO_POR_DEFECTO = 10;

interface VentasResumen {
  total: number;
  cantidadTransacciones: number;
}

interface CajaActual {
  abierta: boolean;
  fondoInicialEfectivo: number | null;
  ventasEfectivoHoy: number | null;
  ventasTransferenciaHoy: number | null;
}

interface FondoGeneral {
  saldoEfectivo: number;
  saldoTransferencia: number;
}

interface ProductosPocoStock {
  cantidad: number;
  productos: { id: string; nombre: string; stockActual: number }[];
}

interface ProductoMasVendido {
  productoId: string;
  nombre: string;
  cantidadVendida: number;
}

interface GastosDelMes {
  total: number;
  cantidad: number;
}

interface DeudasPendientes {
  porCobrar: { cantidad: number; montoTotal: number };
  porPagar: { cantidad: number; montoTotal: number };
}

interface VentaPorDia {
  fecha: string;
  total: number;
}

export interface DashboardVendedor {
  ventasHoy: VentasResumen;
  productosPocoStock: ProductosPocoStock;
}

export interface DashboardAdmin extends DashboardVendedor {
  cajaActual: CajaActual;
  fondoGeneral: FondoGeneral;
  productosMasVendidos: ProductoMasVendido[];
  gastosDelMes: GastosDelMes;
  deudasPendientes: DeudasPendientes;
  ventasUltimos7Dias: VentaPorDia[];
  eventosActivos: null;
  entradasVendidas: null;
}

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async ejecutar(usuarioId: string): Promise<DashboardVendedor | DashboardAdmin> {
    const esAdmin = await this.esAdmin(usuarioId);

    const [ventasHoy, productosPocoStock] = await Promise.all([
      this.calcularVentasHoy(),
      this.calcularProductosPocoStock(),
    ]);

    if (!esAdmin) {
      return { ventasHoy, productosPocoStock };
    }

    const [cajaActual, fondoGeneral, productosMasVendidos, gastosDelMes, deudasPendientes, ventasUltimos7Dias] =
      await Promise.all([
        this.calcularCajaActual(),
        this.calcularFondoGeneral(),
        this.calcularProductosMasVendidos(),
        this.calcularGastosDelMes(),
        this.calcularDeudasPendientes(),
        this.calcularVentasUltimos7Dias(),
      ]);

    return {
      ventasHoy,
      cajaActual,
      fondoGeneral,
      productosPocoStock,
      productosMasVendidos,
      gastosDelMes,
      deudasPendientes,
      ventasUltimos7Dias,
      // TODO: completar cuando exista el módulo Eventos
      eventosActivos: null,
      entradasVendidas: null,
    };
  }

  private async esAdmin(usuarioId: string): Promise<boolean> {
    const asignaciones = await this.prisma.usuarioRol.findMany({
      where: { usuarioId },
      include: { rol: true },
    });
    return asignaciones.some((asignacion) => asignacion.rol.nombre === 'Admin');
  }

  private limitesDeHoy(): { inicio: Date; fin: Date } {
    const ahora = new Date();
    const inicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + 1);
    return { inicio, fin };
  }

  private async calcularVentasHoy(): Promise<VentasResumen> {
    const { inicio, fin } = this.limitesDeHoy();

    const [detalles, cantidadTransacciones] = await Promise.all([
      this.prisma.detalleVenta.findMany({
        where: { estado: 'ACTIVO', venta: { fecha: { gte: inicio, lt: fin } } },
        select: { cantidad: true, precioUnitario: true },
      }),
      this.prisma.venta.count({ where: { fecha: { gte: inicio, lt: fin } } }),
    ]);

    const total = detalles.reduce((acc, d) => acc + d.cantidad * d.precioUnitario.toNumber(), 0);
    return { total, cantidadTransacciones };
  }

  private async calcularCajaActual(): Promise<CajaActual> {
    const caja = await this.prisma.caja.findFirst({ where: { estado: 'ABIERTA' } });
    if (!caja) {
      return {
        abierta: false,
        fondoInicialEfectivo: null,
        ventasEfectivoHoy: null,
        ventasTransferenciaHoy: null,
      };
    }

    // Se agrega por VENTA (no por línea) porque una venta con pago mixto
    // reparte su total entre efectivo y transferencia; si se anuló algún
    // ítem, se escala esa parte proporcionalmente a lo que quedó activo.
    const ventas = await this.prisma.venta.findMany({
      where: { cajaId: caja.id },
      select: {
        total: true,
        montoEfectivo: true,
        montoTransferencia: true,
        detalle: { where: { estado: 'ACTIVO' }, select: { cantidad: true, precioUnitario: true } },
      },
    });

    let ventasEfectivoHoy = 0;
    let ventasTransferenciaHoy = 0;
    for (const venta of ventas) {
      const totalActivo = venta.detalle.reduce(
        (acumulado, detalle) => acumulado + detalle.cantidad * detalle.precioUnitario.toNumber(),
        0,
      );
      const totalOriginal = venta.total.toNumber();
      const factor = totalOriginal > 0 ? totalActivo / totalOriginal : 0;
      ventasEfectivoHoy += venta.montoEfectivo.toNumber() * factor;
      ventasTransferenciaHoy += venta.montoTransferencia.toNumber() * factor;
    }

    return {
      abierta: true,
      fondoInicialEfectivo: caja.fondoInicialEfectivo.toNumber(),
      ventasEfectivoHoy,
      ventasTransferenciaHoy,
    };
  }

  private async calcularFondoGeneral(): Promise<FondoGeneral> {
    const saldo = await this.prisma.saldoGlobal.findUnique({ where: { id: 1 } });
    return {
      saldoEfectivo: saldo?.saldoEfectivo.toNumber() ?? 0,
      saldoTransferencia: saldo?.saldoTransferencia.toNumber() ?? 0,
    };
  }

  private async calcularProductosPocoStock(): Promise<ProductosPocoStock> {
    const config = await this.prisma.configuracionSistema.findUnique({
      where: { clave: CLAVE_STOCK_MINIMO_GLOBAL },
    });
    const umbral = config ? parseInt(config.valor, 10) : STOCK_MINIMO_POR_DEFECTO;

    const productos = await this.prisma.producto.findMany({
      where: { activo: true, stockActual: { lte: umbral } },
      orderBy: { stockActual: 'asc' },
      select: { id: true, nombre: true, stockActual: true },
    });

    return { cantidad: productos.length, productos };
  }

  private async calcularProductosMasVendidos(): Promise<ProductoMasVendido[]> {
    const desde = new Date();
    desde.setDate(desde.getDate() - 30);

    const detalles = await this.prisma.detalleVenta.findMany({
      where: { estado: 'ACTIVO', venta: { fecha: { gte: desde } } },
      select: { productoId: true, cantidad: true },
    });

    const porProducto = new Map<string, number>();
    for (const d of detalles) {
      porProducto.set(d.productoId, (porProducto.get(d.productoId) ?? 0) + d.cantidad);
    }

    const top5 = [...porProducto.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
    if (top5.length === 0) {
      return [];
    }

    const productos = await this.prisma.producto.findMany({
      where: { id: { in: top5.map(([id]) => id) } },
      select: { id: true, nombre: true },
    });

    return top5.map(([productoId, cantidadVendida]) => ({
      productoId,
      nombre: productos.find((p) => p.id === productoId)?.nombre ?? 'Producto eliminado',
      cantidadVendida,
    }));
  }

  private async calcularGastosDelMes(): Promise<GastosDelMes> {
    const ahora = new Date();
    const inicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const fin = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 1);

    const gastos = await this.prisma.gasto.findMany({
      where: { estado: 'ACTIVO', fecha: { gte: inicio, lt: fin } },
      select: { monto: true },
    });

    return {
      total: gastos.reduce((acc, g) => acc + g.monto.toNumber(), 0),
      cantidad: gastos.length,
    };
  }

  private async calcularDeudasPendientes(): Promise<DeudasPendientes> {
    const deudas = await this.prisma.deuda.findMany({
      where: { estado: { in: ['PENDIENTE', 'PARCIAL'] } },
      select: { tipo: true, montoTotal: true },
    });

    const resumen = (tipo: 'POR_COBRAR' | 'POR_PAGAR') => {
      const filtradas = deudas.filter((d) => d.tipo === tipo);
      return {
        cantidad: filtradas.length,
        montoTotal: filtradas.reduce((acc, d) => acc + d.montoTotal.toNumber(), 0),
      };
    };

    return { porCobrar: resumen('POR_COBRAR'), porPagar: resumen('POR_PAGAR') };
  }

  private async calcularVentasUltimos7Dias(): Promise<VentaPorDia[]> {
    const ahora = new Date();
    const desde = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    desde.setDate(desde.getDate() - 6);

    const detalles = await this.prisma.detalleVenta.findMany({
      where: { estado: 'ACTIVO', venta: { fecha: { gte: desde } } },
      select: { cantidad: true, precioUnitario: true, venta: { select: { fecha: true } } },
    });

    const porDia = new Map<string, number>();
    for (let i = 0; i < 7; i++) {
      const dia = new Date(desde);
      dia.setDate(dia.getDate() + i);
      porDia.set(dia.toISOString().slice(0, 10), 0);
    }

    for (const d of detalles) {
      const clave = d.venta.fecha.toISOString().slice(0, 10);
      const subtotal = d.cantidad * d.precioUnitario.toNumber();
      porDia.set(clave, (porDia.get(clave) ?? 0) + subtotal);
    }

    return [...porDia.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([fecha, total]) => ({ fecha, total }));
  }
}
