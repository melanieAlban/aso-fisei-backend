import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import { Rol } from '../domain/rol.entity';
import { RolRepository } from '../domain/rol.repository';

@Injectable()
export class RolRepositoryPrisma implements RolRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listarTodos(): Promise<Rol[]> {
    const registros = await this.prisma.rol.findMany({ orderBy: { nombre: 'asc' } });
    return registros.map((registro) => new Rol(registro.id, registro.nombre));
  }

  async buscarPorId(id: string): Promise<Rol | null> {
    const registro = await this.prisma.rol.findUnique({ where: { id } });
    return registro ? new Rol(registro.id, registro.nombre) : null;
  }
}
