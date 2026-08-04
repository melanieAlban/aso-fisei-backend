import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import { ConfiguracionSistemaRepository } from '../domain/configuracion-sistema.repository';

@Injectable()
export class ConfiguracionSistemaRepositoryPrisma implements ConfiguracionSistemaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async obtener(clave: string): Promise<string | null> {
    const registro = await this.prisma.configuracionSistema.findUnique({ where: { clave } });
    return registro?.valor ?? null;
  }

  async actualizar(clave: string, valor: string): Promise<void> {
    await this.prisma.configuracionSistema.upsert({
      where: { clave },
      update: { valor },
      create: { clave, valor },
    });
  }
}
