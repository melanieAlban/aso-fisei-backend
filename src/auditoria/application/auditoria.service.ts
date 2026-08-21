import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';

export interface FiltrosAuditLog {
  usuarioId?: string;
  modulo?: string;
  accion?: string;
  desde?: Date;
  hasta?: Date;
  page?: number;
  limit?: number;
}

export interface AuditLogRegistro {
  id: string;
  usuarioId: string | null;
  usuarioNombre: string | null;
  modulo: string;
  accion: string;
  registroAfectado: string | null;
  valorAnterior: Prisma.JsonValue | null;
  valorNuevo: Prisma.JsonValue | null;
  fecha: Date;
}

@Injectable()
export class AuditoriaService {
  constructor(private readonly prisma: PrismaService) {}

  async listar(
    filtros: FiltrosAuditLog,
  ): Promise<{ registros: AuditLogRegistro[]; total: number; page: number; limit: number }> {
    const page = filtros.page && filtros.page > 0 ? filtros.page : 1;
    const limit = filtros.limit && filtros.limit > 0 ? filtros.limit : 20;

    const where: Prisma.AuditoriaWhereInput = {
      ...(filtros.usuarioId ? { usuarioId: filtros.usuarioId } : {}),
      ...(filtros.modulo ? { modulo: { contains: filtros.modulo, mode: 'insensitive' } } : {}),
      ...(filtros.accion ? { accion: { contains: filtros.accion, mode: 'insensitive' } } : {}),
      ...(filtros.desde || filtros.hasta
        ? {
            fecha: {
              ...(filtros.desde ? { gte: filtros.desde } : {}),
              ...(filtros.hasta ? { lte: filtros.hasta } : {}),
            },
          }
        : {}),
    };

    const [registros, total] = await this.prisma.$transaction([
      this.prisma.auditoria.findMany({
        where,
        include: { usuario: { select: { nombre: true } } },
        orderBy: { fecha: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.auditoria.count({ where }),
    ]);

    return {
      registros: registros.map((registro) => ({
        id: registro.id,
        usuarioId: registro.usuarioId,
        usuarioNombre: registro.usuario?.nombre ?? null,
        modulo: registro.modulo,
        accion: registro.accion,
        registroAfectado: registro.registroAfectado,
        valorAnterior: registro.valorAnterior,
        valorNuevo: registro.valorNuevo,
        fecha: registro.fecha,
      })),
      total,
      page,
      limit,
    };
  }
}
