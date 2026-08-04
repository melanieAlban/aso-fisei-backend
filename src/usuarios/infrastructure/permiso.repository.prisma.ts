import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import { Permiso } from '../domain/permiso.entity';
import { PermisoRepository } from '../domain/permiso.repository';

@Injectable()
export class PermisoRepositoryPrisma implements PermisoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listarTodos(): Promise<Permiso[]> {
    const registros = await this.prisma.permiso.findMany({ orderBy: { codigo: 'asc' } });
    return registros.map((registro) => new Permiso(registro.id, registro.codigo, registro.descripcion));
  }

  async buscarPorId(id: string): Promise<Permiso | null> {
    const registro = await this.prisma.permiso.findUnique({ where: { id } });
    return registro ? new Permiso(registro.id, registro.codigo, registro.descripcion) : null;
  }
}
