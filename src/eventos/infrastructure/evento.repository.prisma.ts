import { Injectable } from '@nestjs/common';
import { Evento as EventoPrisma } from '@prisma/client';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import { Evento } from '../domain/evento.entity';
import { EventoRepository } from '../domain/evento.repository';

@Injectable()
export class EventoRepositoryPrisma implements EventoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(evento: Evento): Promise<Evento> {
    const creado = await this.prisma.evento.create({
      data: {
        id: evento.id,
        nombre: evento.nombre,
        presupuesto: evento.presupuesto,
        estado: evento.estado,
        fechaInicio: evento.fechaInicio,
        fechaFin: evento.fechaFin,
        fechaCierre: evento.fechaCierre,
      },
    });

    return this.aDominio(creado);
  }

  async guardar(evento: Evento): Promise<Evento> {
    const actualizado = await this.prisma.evento.update({
      where: { id: evento.id },
      data: {
        nombre: evento.nombre,
        presupuesto: evento.presupuesto,
        estado: evento.estado,
        fechaInicio: evento.fechaInicio,
        fechaFin: evento.fechaFin,
        fechaCierre: evento.fechaCierre,
        motivoAnulacion: evento.motivoAnulacion,
        usuarioAnulacionId: evento.usuarioAnulacionId,
      },
    });

    return this.aDominio(actualizado);
  }

  async buscarPorId(id: string): Promise<Evento | null> {
    const encontrado = await this.prisma.evento.findUnique({ where: { id } });
    return encontrado ? this.aDominio(encontrado) : null;
  }

  async listarTodos(page: number, limit: number): Promise<{ eventos: Evento[]; total: number }> {
    const [registros, total] = await this.prisma.$transaction([
      this.prisma.evento.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { fechaInicio: 'desc' },
      }),
      this.prisma.evento.count(),
    ]);

    return { eventos: registros.map((registro) => this.aDominio(registro)), total };
  }

  private aDominio(registro: EventoPrisma): Evento {
    return new Evento(
      registro.id,
      registro.nombre,
      registro.presupuesto ? registro.presupuesto.toNumber() : null,
      registro.estado,
      registro.fechaInicio,
      registro.fechaFin,
      registro.fechaCierre,
      registro.motivoAnulacion,
      registro.usuarioAnulacionId,
    );
  }
}
