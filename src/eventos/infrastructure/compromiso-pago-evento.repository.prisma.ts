import { Injectable } from '@nestjs/common';
import { CompromisoPagoEvento as CompromisoPagoEventoPrisma } from '@prisma/client';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import { CompromisoPagoEvento } from '../domain/compromiso-pago-evento.entity';
import { CompromisoPagoEventoRepository } from '../domain/compromiso-pago-evento.repository';

@Injectable()
export class CompromisoPagoEventoRepositoryPrisma implements CompromisoPagoEventoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(compromiso: CompromisoPagoEvento): Promise<CompromisoPagoEvento> {
    const creado = await this.prisma.compromisoPagoEvento.create({
      data: {
        id: compromiso.id,
        eventoId: compromiso.eventoId,
        descripcion: compromiso.descripcion,
        montoTotal: compromiso.montoTotal,
        montoPagado: compromiso.montoPagado,
        fecha: compromiso.fecha,
      },
    });

    return this.aDominio(creado);
  }

  async guardar(compromiso: CompromisoPagoEvento): Promise<CompromisoPagoEvento> {
    const actualizado = await this.prisma.compromisoPagoEvento.update({
      where: { id: compromiso.id },
      data: {
        descripcion: compromiso.descripcion,
        montoTotal: compromiso.montoTotal,
        montoPagado: compromiso.montoPagado,
      },
    });

    return this.aDominio(actualizado);
  }

  async eliminar(id: string): Promise<void> {
    await this.prisma.compromisoPagoEvento.delete({ where: { id } });
  }

  async buscarPorId(id: string): Promise<CompromisoPagoEvento | null> {
    const encontrado = await this.prisma.compromisoPagoEvento.findUnique({ where: { id } });
    return encontrado ? this.aDominio(encontrado) : null;
  }

  async listarPorEvento(eventoId: string): Promise<CompromisoPagoEvento[]> {
    const registros = await this.prisma.compromisoPagoEvento.findMany({
      where: { eventoId },
      orderBy: { fecha: 'desc' },
    });

    return registros.map((registro) => this.aDominio(registro));
  }

  private aDominio(registro: CompromisoPagoEventoPrisma): CompromisoPagoEvento {
    return new CompromisoPagoEvento(
      registro.id,
      registro.eventoId,
      registro.descripcion,
      registro.montoTotal.toNumber(),
      registro.montoPagado.toNumber(),
      registro.fecha,
    );
  }
}
