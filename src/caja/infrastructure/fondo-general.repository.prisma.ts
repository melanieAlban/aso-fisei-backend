import { Injectable } from '@nestjs/common';
import { MovimientoFondoGeneral as MovimientoPrisma } from '@prisma/client';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import {
  FondoGeneralRepository,
  SaldoGlobalValor,
} from '../domain/fondo-general.repository';
import { MovimientoFondoGeneral } from '../domain/movimiento-fondo-general.entity';

@Injectable()
export class FondoGeneralRepositoryPrisma implements FondoGeneralRepository {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerSaldo(): Promise<SaldoGlobalValor> {
    const saldo = await this.prisma.saldoGlobal.findUniqueOrThrow({ where: { id: 1 } });

    return {
      saldoEfectivo: saldo.saldoEfectivo.toNumber(),
      saldoTransferencia: saldo.saldoTransferencia.toNumber(),
    };
  }

  async listarMovimientos(
    page: number,
    limit: number,
  ): Promise<{ movimientos: MovimientoFondoGeneral[]; total: number }> {
    const [registros, total] = await this.prisma.$transaction([
      this.prisma.movimientoFondoGeneral.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { fecha: 'desc' },
      }),
      this.prisma.movimientoFondoGeneral.count(),
    ]);

    return { movimientos: registros.map((registro) => this.aDominio(registro)), total };
  }

  private aDominio(registro: MovimientoPrisma): MovimientoFondoGeneral {
    return new MovimientoFondoGeneral(
      registro.id,
      registro.usuarioId,
      registro.tipo,
      registro.monto.toNumber(),
      registro.metodoPago,
      registro.saldoResultanteEfectivo.toNumber(),
      registro.saldoResultanteTransferencia.toNumber(),
      registro.referenciaId,
      registro.descripcion,
      registro.fecha,
    );
  }
}
