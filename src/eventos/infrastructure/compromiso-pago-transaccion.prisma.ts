import { Injectable } from '@nestjs/common';
import { CompromisoPagoEvento as CompromisoPagoEventoPrisma } from '@prisma/client';
import { ConflictError, NotFoundError } from '../../shared/domain/errors';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import { CompromisoPagoEvento } from '../domain/compromiso-pago-evento.entity';
import {
  CompromisoPagoTransaccionPort,
  RegistrarAbonoCompromisoDatos,
} from '../application/ports/compromiso-pago-transaccion.port';

@Injectable()
export class CompromisoPagoTransaccionPrisma implements CompromisoPagoTransaccionPort {
  constructor(private readonly prisma: PrismaService) {}

  async registrarAbono(datos: RegistrarAbonoCompromisoDatos): Promise<CompromisoPagoEvento> {
    if (datos.monto <= 0) {
      throw new ConflictError('El monto del abono debe ser mayor a 0');
    }

    return this.prisma.$transaction(async (tx) => {
      const compromiso = await tx.compromisoPagoEvento.findUnique({
        where: { id: datos.compromisoId },
      });
      if (!compromiso) {
        throw new NotFoundError('Compromiso de pago no encontrado');
      }

      const evento = await tx.evento.findUnique({ where: { id: compromiso.eventoId } });
      if (!evento) {
        throw new NotFoundError('Evento no encontrado');
      }
      if (evento.estado !== 'ACTIVO') {
        throw new ConflictError('El evento no está activo');
      }

      const nuevoPagado = compromiso.montoPagado.toNumber() + datos.monto;
      if (Math.round(nuevoPagado * 100) > Math.round(compromiso.montoTotal.toNumber() * 100)) {
        throw new ConflictError('El abono excede el saldo pendiente del compromiso');
      }

      const actualizado = await tx.compromisoPagoEvento.update({
        where: { id: datos.compromisoId },
        data: { montoPagado: nuevoPagado },
      });

      await tx.gastoEvento.create({
        data: {
          id: crypto.randomUUID(),
          eventoId: compromiso.eventoId,
          usuarioId: datos.usuarioId,
          descripcion: `Abono: ${compromiso.descripcion}`,
          monto: datos.monto,
          metodoPago: datos.metodoPago,
        },
      });

      return this.aDominio(actualizado);
    });
  }

  private aDominio(registro: CompromisoPagoEventoPrisma): CompromisoPagoEvento {
    return new CompromisoPagoEvento(
      registro.id,
      registro.eventoId,
      registro.descripcion,
      registro.montoTotal.toNumber(),
      registro.montoPagado.toNumber(),
      registro.fecha,
    );
  }
}
