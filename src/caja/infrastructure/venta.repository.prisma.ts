import { Injectable } from '@nestjs/common';
import {
  DetalleVenta as DetallePrisma,
  Prisma,
  Venta as VentaPrisma,
} from '@prisma/client';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import { DetalleVenta } from '../domain/detalle-venta.entity';
import { Venta } from '../domain/venta.entity';
import {
  FiltrosVentas,
  ResumenDiario,
  VentaConDetalle,
  VentaRepository,
} from '../domain/venta.repository';

type VentaConDetallePrisma = VentaPrisma & { detalle: DetallePrisma[] };

@Injectable()
export class VentaRepositoryPrisma implements VentaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async buscarPorId(id: string): Promise<VentaConDetalle | null> {
    const encontrada = await this.prisma.venta.findUnique({
      where: { id },
      include: { detalle: true },
    });

    return encontrada ? this.aDominioConDetalle(encontrada) : null;
  }

  async listarTodos(
    filtros: FiltrosVentas,
    page: number,
    limit: number,
  ): Promise<{ ventas: VentaConDetalle[]; total: number }> {
    const where = this.construirFiltroFecha(filtros);

    const [registros, total] = await this.prisma.$transaction([
      this.prisma.venta.findMany({
        where,
        include: { detalle: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { fecha: 'desc' },
      }),
      this.prisma.venta.count({ where }),
    ]);

    return { ventas: registros.map((registro) => this.aDominioConDetalle(registro)), total };
  }

  async buscarDetallePorId(itemId: string): Promise<DetalleVenta | null> {
    const encontrado = await this.prisma.detalleVenta.findUnique({ where: { id: itemId } });
    return encontrado ? this.detalleADominio(encontrado) : null;
  }

  async marcarAlquilerDevuelto(itemId: string): Promise<DetalleVenta> {
    const actualizado = await this.prisma.detalleVenta.update({
      where: { id: itemId },
      data: { estadoAlquiler: 'DEVUELTO' },
    });

    return this.detalleADominio(actualizado);
  }

  async resumenDiarioPorCaja(cajaId: string): Promise<ResumenDiario[]> {
    const detalles = await this.prisma.detalleVenta.findMany({
      where: { estado: 'ACTIVO', venta: { cajaId } },
      include: { venta: true },
    });

    const porDia = new Map<
      string,
      { totalEfectivo: number; totalTransferencia: number; ventasIds: Set<string> }
    >();

    for (const detalle of detalles) {
      const fechaClave = detalle.venta.fecha.toISOString().slice(0, 10);
      const entrada = porDia.get(fechaClave) ?? {
        totalEfectivo: 0,
        totalTransferencia: 0,
        ventasIds: new Set<string>(),
      };
      const subtotal = detalle.cantidad * detalle.precioUnitario.toNumber();

      if (detalle.venta.metodoPago === 'EFECTIVO') {
        entrada.totalEfectivo += subtotal;
      } else {
        entrada.totalTransferencia += subtotal;
      }
      entrada.ventasIds.add(detalle.venta.id);

      porDia.set(fechaClave, entrada);
    }

    return Array.from(porDia.entries())
      .map(([fecha, valores]) => ({
        fecha,
        totalEfectivo: valores.totalEfectivo,
        totalTransferencia: valores.totalTransferencia,
        cantidadVentas: valores.ventasIds.size,
      }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
  }

  private construirFiltroFecha(filtros: FiltrosVentas): Prisma.VentaWhereInput {
    if (!filtros.desde && !filtros.hasta) {
      return {};
    }

    return {
      fecha: {
        ...(filtros.desde ? { gte: filtros.desde } : {}),
        ...(filtros.hasta ? { lte: filtros.hasta } : {}),
      },
    };
  }

  private aDominioConDetalle(registro: VentaConDetallePrisma): VentaConDetalle {
    return {
      venta: this.ventaADominio(registro),
      detalles: registro.detalle.map((detalle) => this.detalleADominio(detalle)),
    };
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
    );
  }
}
