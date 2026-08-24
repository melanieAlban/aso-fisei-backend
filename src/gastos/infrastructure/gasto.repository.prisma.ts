import { Injectable } from '@nestjs/common';
import { Gasto as GastoPrisma, Prisma } from '@prisma/client';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import { Gasto } from '../domain/gasto.entity';
import { FiltrosGastos, GastoRepository } from '../domain/gasto.repository';

@Injectable()
export class GastoRepositoryPrisma implements GastoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async buscarPorId(id: string): Promise<Gasto | null> {
    const encontrado = await this.prisma.gasto.findUnique({ where: { id } });
    return encontrado ? this.aDominio(encontrado) : null;
  }

  async listarTodos(
    filtros: FiltrosGastos,
    page: number,
    limit: number,
  ): Promise<{ gastos: Gasto[]; total: number }> {
    const where = this.construirFiltros(filtros);

    const [registros, total] = await this.prisma.$transaction([
      this.prisma.gasto.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { fecha: 'desc' },
      }),
      this.prisma.gasto.count({ where }),
    ]);

    return { gastos: registros.map((registro) => this.aDominio(registro)), total };
  }

  async listarCategorias(): Promise<string[]> {
    const registros = await this.prisma.gasto.findMany({
      select: { categoria: true },
      distinct: ['categoria'],
      orderBy: { categoria: 'asc' },
    });

    return registros.map((registro) => registro.categoria);
  }

  private construirFiltros(filtros: FiltrosGastos): Prisma.GastoWhereInput {
    return {
      ...(filtros.categoria ? { categoria: filtros.categoria } : {}),
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

  private aDominio(registro: GastoPrisma): Gasto {
    return new Gasto(
      registro.id,
      registro.usuarioId,
      registro.descripcion,
      registro.monto.toNumber(),
      registro.categoria,
      registro.fuentePago,
      registro.montoEfectivoFondo.toNumber(),
      registro.montoTransferenciaFondo.toNumber(),
      registro.generadoAutomaticamente,
      registro.estado,
      registro.motivoAnulacion,
      registro.usuarioAnulacionId,
      registro.fecha,
    );
  }
}
