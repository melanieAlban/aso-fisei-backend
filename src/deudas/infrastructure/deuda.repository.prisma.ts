import { Injectable } from '@nestjs/common';
import {
  AbonoDeuda as AbonoPrisma,
  Deuda as DeudaPrisma,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import { AbonoDeuda } from '../domain/abono-deuda.entity';
import { Deuda } from '../domain/deuda.entity';
import {
  DeudaConAbonos,
  DeudaRepository,
  FiltrosDeudas,
} from '../domain/deuda.repository';

type DeudaConAbonosPrisma = DeudaPrisma & { abonos: AbonoPrisma[] };

@Injectable()
export class DeudaRepositoryPrisma implements DeudaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(deuda: Deuda): Promise<Deuda> {
    const creada = await this.prisma.deuda.create({
      data: {
        id: deuda.id,
        usuarioId: deuda.usuarioId,
        gastoId: deuda.gastoId,
        tipo: deuda.tipo,
        contraparte: deuda.contraparte,
        montoTotal: deuda.montoTotal,
        montoAbonado: deuda.montoAbonado,
        estado: deuda.estado,
      },
    });

    return this.deudaADominio(creada);
  }

  async buscarPorId(id: string): Promise<DeudaConAbonos | null> {
    const encontrada = await this.prisma.deuda.findUnique({
      where: { id },
      include: { abonos: true },
    });

    return encontrada ? this.aDominioConAbonos(encontrada) : null;
  }

  async listarTodos(
    filtros: FiltrosDeudas,
    page: number,
    limit: number,
  ): Promise<{ deudas: DeudaConAbonos[]; total: number }> {
    const where: Prisma.DeudaWhereInput = {
      ...(filtros.tipo ? { tipo: filtros.tipo } : {}),
      ...(filtros.estado ? { estado: filtros.estado } : {}),
    };

    const [registros, total] = await this.prisma.$transaction([
      this.prisma.deuda.findMany({
        where,
        include: { abonos: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { fechaRegistro: 'desc' },
      }),
      this.prisma.deuda.count({ where }),
    ]);

    return { deudas: registros.map((registro) => this.aDominioConAbonos(registro)), total };
  }

  private aDominioConAbonos(registro: DeudaConAbonosPrisma): DeudaConAbonos {
    return {
      deuda: this.deudaADominio(registro),
      abonos: registro.abonos.map((abono) => this.abonoADominio(abono)),
    };
  }

  private deudaADominio(registro: DeudaPrisma): Deuda {
    return new Deuda(
      registro.id,
      registro.usuarioId,
      registro.gastoId,
      registro.tipo,
      registro.contraparte,
      registro.montoTotal.toNumber(),
      registro.montoAbonado.toNumber(),
      registro.estado,
      registro.fechaRegistro,
    );
  }

  private abonoADominio(registro: AbonoPrisma): AbonoDeuda {
    return new AbonoDeuda(
      registro.id,
      registro.deudaId,
      registro.usuarioId,
      registro.monto.toNumber(),
      registro.metodoPago,
      registro.fecha,
    );
  }
}
