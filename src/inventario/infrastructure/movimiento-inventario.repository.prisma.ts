import { Injectable } from '@nestjs/common';
import { MovimientoInventario as MovimientoPrisma, Prisma } from '@prisma/client';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import { MovimientoInventario } from '../domain/movimiento-inventario.entity';
import {
  FiltrosMovimientos,
  MovimientoInventarioRepository,
} from '../domain/movimiento-inventario.repository';

@Injectable()
export class MovimientoInventarioRepositoryPrisma implements MovimientoInventarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(movimiento: MovimientoInventario): Promise<MovimientoInventario> {
    const creado = await this.prisma.movimientoInventario.create({
      data: {
        id: movimiento.id,
        productoId: movimiento.productoId,
        usuarioId: movimiento.usuarioId,
        tipo: movimiento.tipo,
        cantidad: movimiento.cantidad,
        motivo: movimiento.motivo,
        gastoId: movimiento.gastoId,
      },
    });

    return this.aDominio(creado);
  }

  async listarPorProducto(
    productoId: string,
    filtros?: FiltrosMovimientos,
  ): Promise<MovimientoInventario[]> {
    const registros = await this.prisma.movimientoInventario.findMany({
      where: { productoId, ...this.construirFiltroFecha(filtros) },
      orderBy: { fecha: 'desc' },
    });

    return registros.map((registro) => this.aDominio(registro));
  }

  async listarTodos(filtros?: FiltrosMovimientos): Promise<MovimientoInventario[]> {
    const registros = await this.prisma.movimientoInventario.findMany({
      where: this.construirFiltroFecha(filtros),
      orderBy: { fecha: 'desc' },
    });

    return registros.map((registro) => this.aDominio(registro));
  }

  private construirFiltroFecha(filtros?: FiltrosMovimientos): Prisma.MovimientoInventarioWhereInput {
    if (!filtros) {
      return {};
    }

    return {
      ...(filtros.tipo ? { tipo: filtros.tipo } : {}),
      ...(filtros.desde || filtros.hasta
        ? {
            fecha: {
              ...(filtros.desde ? { gte: filtros.desde } : {}),
              ...(filtros.hasta ? { lte: filtros.hasta } : {}),
            },
          }
        : {}),
    };
  }

  private aDominio(registro: MovimientoPrisma): MovimientoInventario {
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
