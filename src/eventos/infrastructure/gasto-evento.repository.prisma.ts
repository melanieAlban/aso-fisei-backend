import { Injectable } from '@nestjs/common';
import { GastoEvento as GastoEventoPrisma } from '@prisma/client';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import { GastoEvento } from '../domain/gasto-evento.entity';
import { GastoEventoRepository } from '../domain/gasto-evento.repository';

@Injectable()
export class GastoEventoRepositoryPrisma implements GastoEventoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(gasto: GastoEvento): Promise<GastoEvento> {
    const creado = await this.prisma.gastoEvento.create({
      data: {
        id: gasto.id,
        eventoId: gasto.eventoId,
        usuarioId: gasto.usuarioId,
        descripcion: gasto.descripcion,
        monto: gasto.monto,
        metodoPago: gasto.metodoPago,
        fecha: gasto.fecha,
      },
    });

    return this.aDominio(creado);
  }

  async listarPorEvento(eventoId: string): Promise<GastoEvento[]> {
    const registros = await this.prisma.gastoEvento.findMany({ where: { eventoId } });
    return registros.map((registro) => this.aDominio(registro));
  }

  private aDominio(registro: GastoEventoPrisma): GastoEvento {
    return new GastoEvento(
      registro.id,
      registro.eventoId,
      registro.usuarioId,
      registro.descripcion,
      registro.monto.toNumber(),
      registro.metodoPago,
      registro.fecha,
    );
  }
}
