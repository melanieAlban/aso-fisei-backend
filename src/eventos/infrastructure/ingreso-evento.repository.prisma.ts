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

  async guardar(ingreso: IngresoEvento): Promise<IngresoEvento> {
    const actualizado = await this.prisma.ingresoEvento.update({
      where: { id: ingreso.id },
      data: {
        descripcion: ingreso.descripcion,
        monto: ingreso.monto,
        metodoPago: ingreso.metodoPago,
      },
    });

    return this.aDominio(actualizado);
  }

  async eliminar(id: string): Promise<void> {
    await this.prisma.ingresoEvento.delete({ where: { id } });
  }

  async buscarPorId(id: string): Promise<IngresoEvento | null> {
    const encontrado = await this.prisma.ingresoEvento.findUnique({ where: { id } });
    return encontrado ? this.aDominio(encontrado) : null;
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
