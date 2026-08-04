import { Injectable } from '@nestjs/common';
import { Usuario as UsuarioPrisma } from '@prisma/client';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import { Usuario } from '../domain/usuario.entity';
import { UsuarioRepository } from '../domain/usuario.repository';

@Injectable()
export class UsuarioRepositoryPrisma implements UsuarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async buscarPorUsuario(usuario: string): Promise<Usuario | null> {
    const encontrado = await this.prisma.usuario.findUnique({ where: { usuario } });
    return encontrado ? this.aDominio(encontrado) : null;
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    const encontrado = await this.prisma.usuario.findUnique({ where: { id } });
    return encontrado ? this.aDominio(encontrado) : null;
  }

  async guardar(usuario: Usuario): Promise<Usuario> {
    const guardado = await this.prisma.usuario.upsert({
      where: { id: usuario.id },
      create: {
        id: usuario.id,
        nombre: usuario.nombre,
        usuario: usuario.usuario,
        passwordHash: usuario.passwordHash,
        activo: usuario.activo,
        fechaUltimoAcceso: usuario.fechaUltimoAcceso,
      },
      update: {
        nombre: usuario.nombre,
        usuario: usuario.usuario,
        passwordHash: usuario.passwordHash,
        activo: usuario.activo,
        fechaUltimoAcceso: usuario.fechaUltimoAcceso,
      },
    });

    return this.aDominio(guardado);
  }

  async listarTodos(page: number, limit: number): Promise<{ usuarios: Usuario[]; total: number }> {
    const [registros, total] = await this.prisma.$transaction([
      this.prisma.usuario.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.usuario.count(),
    ]);

    return { usuarios: registros.map((registro) => this.aDominio(registro)), total };
  }

  private aDominio(registro: UsuarioPrisma): Usuario {
    return new Usuario(
      registro.id,
      registro.nombre,
      registro.usuario,
      registro.passwordHash,
      registro.activo,
      registro.fechaUltimoAcceso,
    );
  }
}
