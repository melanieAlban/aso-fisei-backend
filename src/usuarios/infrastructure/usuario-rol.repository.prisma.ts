import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import { UsuarioRolRepository } from '../domain/usuario-rol.repository';

@Injectable()
export class UsuarioRolRepositoryPrisma implements UsuarioRolRepository {
  constructor(private readonly prisma: PrismaService) {}

  async existeAsignacion(usuarioId: string, rolId: string): Promise<boolean> {
    const registro = await this.prisma.usuarioRol.findUnique({
      where: { usuarioId_rolId: { usuarioId, rolId } },
    });
    return !!registro;
  }

  async asignar(usuarioId: string, rolId: string): Promise<void> {
    await this.prisma.usuarioRol.create({ data: { usuarioId, rolId } });
  }
}
