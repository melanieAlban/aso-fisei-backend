import { Injectable } from '@nestjs/common';
import { IngresoEvento as IngresoEventoPrisma } from '@prisma/client';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import { IngresoEvento } from '../domain/ingreso-evento.entity';
import { IngresoEventoRepository } from '../domain/ingreso-evento.repository';

@Injectable()
export class IngresoEventoRepositoryPrisma implements IngresoEventoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(ingreso: IngresoEvento): Promise<IngresoEvento> {
    const creado = await this.prisma.ingresoEvento.create({
      data: {
        id: ingreso.id,
        eventoId: ingreso.eventoId,
        usuarioId: ingreso.usuarioId,
        descripcion: ingreso.descripcion,
        monto: ingreso.monto,
        metodoPago: ingreso.metodoPago,
        fecha: ingreso.fecha,
      },
    });

    return this.aDominio(creado);
  }

  async listarPorEvento(eventoId: string): Promise<IngresoEvento[]> {
    const registros = await this.prisma.ingresoEvento.findMany({ where: { eventoId } });
    return registros.map((registro) => this.aDominio(registro));
  }

  private aDominio(registro: IngresoEventoPrisma): IngresoEvento {
    return new IngresoEvento(
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
