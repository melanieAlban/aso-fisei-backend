import { Injectable } from '@nestjs/common';
import { TemporizadorActivo as TemporizadorActivoPrisma } from '@prisma/client';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import { TemporizadorActivo } from '../domain/temporizador-activo.entity';
import { TemporizadorActivoRepository } from '../domain/temporizador-activo.repository';

@Injectable()
export class TemporizadorActivoRepositoryPrisma implements TemporizadorActivoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(temporizador: TemporizadorActivo): Promise<TemporizadorActivo> {
    const creado = await this.prisma.temporizadorActivo.create({
      data: {
        id: temporizador.id,
        nombre: temporizador.nombre,
        horaInicio: temporizador.horaInicio,
        horaFin: temporizador.horaFin,
        usuarioId: temporizador.usuarioId,
        fecha: temporizador.fecha,
      },
    });

    return this.aDominio(creado);
  }

  async eliminar(id: string): Promise<void> {
    await this.prisma.temporizadorActivo.delete({ where: { id } });
  }

  async listarTodos(): Promise<TemporizadorActivo[]> {
    const registros = await this.prisma.temporizadorActivo.findMany({ orderBy: { fecha: 'desc' } });
    return registros.map((registro) => this.aDominio(registro));
  }

  private aDominio(registro: TemporizadorActivoPrisma): TemporizadorActivo {
    return new TemporizadorActivo(
      registro.id,
      registro.nombre,
      registro.horaInicio,
      registro.horaFin,
      registro.usuarioId,
      registro.fecha,
    );
  }
}
