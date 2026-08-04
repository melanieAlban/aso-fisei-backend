import { Injectable } from '@nestjs/common';
import { Caja as CajaPrisma } from '@prisma/client';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import { Caja } from '../domain/caja.entity';
import { CajaRepository } from '../domain/caja.repository';

@Injectable()
export class CajaRepositoryPrisma implements CajaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async buscarAbierta(): Promise<Caja | null> {
    const encontrada = await this.prisma.caja.findFirst({ where: { estado: 'ABIERTA' } });
    return encontrada ? this.aDominio(encontrada) : null;
  }

  async buscarPorId(id: string): Promise<Caja | null> {
    const encontrada = await this.prisma.caja.findUnique({ where: { id } });
    return encontrada ? this.aDominio(encontrada) : null;
  }

  private aDominio(registro: CajaPrisma): Caja {
    return new Caja(
      registro.id,
      registro.usuarioAperturaId,
      registro.usuarioCierreId,
      registro.fondoInicialEfectivo.toNumber(),
      registro.estado,
      registro.fechaApertura,
      registro.fechaCierre,
    );
  }
}
