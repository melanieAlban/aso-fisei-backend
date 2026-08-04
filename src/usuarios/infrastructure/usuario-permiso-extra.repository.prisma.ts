import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import { UsuarioPermisoExtraRepository } from '../domain/usuario-permiso-extra.repository';

@Injectable()
export class UsuarioPermisoExtraRepositoryPrisma implements UsuarioPermisoExtraRepository {
  constructor(private readonly prisma: PrismaService) {}

  async otorgar(datos: {
    usuarioId: string;
    permisoId: string;
    otorgadoPorUsuarioId: string;
  }): Promise<void> {
    await this.prisma.usuarioPermisoExtra.create({ data: datos });
  }

  async revocar(usuarioId: string, permisoId: string): Promise<void> {
    await this.prisma.usuarioPermisoExtra.deleteMany({ where: { usuarioId, permisoId } });
  }
}
