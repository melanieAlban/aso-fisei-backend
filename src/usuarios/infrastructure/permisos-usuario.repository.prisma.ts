import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import { PermisosUsuarioRepository } from '../domain/permisos-usuario.repository';

@Injectable()
export class PermisosUsuarioRepositoryPrisma implements PermisosUsuarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async usuarioTienePermiso(usuarioId: string, codigoPermiso: string): Promise<boolean> {
    const porRol = await this.prisma.usuarioRol.findFirst({
      where: {
        usuarioId,
        rol: { permisos: { some: { permiso: { codigo: codigoPermiso } } } },
      },
    });

    if (porRol) {
      return true;
    }

    const porExtra = await this.prisma.usuarioPermisoExtra.findFirst({
      where: { usuarioId, permiso: { codigo: codigoPermiso } },
    });

    return !!porExtra;
  }
}
