import { Injectable } from '@nestjs/common';
import { ArqueoCaja as ArqueoCajaPrisma } from '@prisma/client';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import { ArqueoCaja, ClasificacionDiferencia } from '../domain/arqueo-caja.entity';
import { ArqueoCajaRepository } from '../domain/arqueo-caja.repository';

@Injectable()
export class ArqueoCajaRepositoryPrisma implements ArqueoCajaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async buscarPorId(id: string): Promise<ArqueoCaja | null> {
    const encontrado = await this.prisma.arqueoCaja.findUnique({ where: { id } });
    return encontrado ? this.aDominio(encontrado) : null;
  }

  async actualizarClasificacion(
    id: string,
    clasificacion: ClasificacionDiferencia,
  ): Promise<ArqueoCaja> {
    const actualizado = await this.prisma.arqueoCaja.update({
      where: { id },
      data: { clasificacionDiferencia: clasificacion },
    });

    return this.aDominio(actualizado);
  }

  private aDominio(registro: ArqueoCajaPrisma): ArqueoCaja {
    return new ArqueoCaja(
      registro.id,
      registro.cajaId,
      registro.usuarioId,
      registro.efectivoEsperado.toNumber(),
      registro.efectivoContado.toNumber(),
      registro.transferenciaEsperado.toNumber(),
      registro.transferenciaContado.toNumber(),
      registro.montoRetiradoEfectivo.toNumber(),
      registro.montoRetiradoTransferencia.toNumber(),
      registro.montoDejadoFondoCambio.toNumber(),
      registro.clasificacionDiferencia,
      registro.fecha,
    );
  }
}
