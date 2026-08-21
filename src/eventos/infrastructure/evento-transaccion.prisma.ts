import { Injectable } from '@nestjs/common';
import { Evento as EventoPrisma, MetodoPago, Prisma, SaldoGlobal } from '@prisma/client';
import { ConflictError, NotFoundError } from '../../shared/domain/errors';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import { Evento } from '../domain/evento.entity';
import {
  CerrarEventoDatos,
  EventoTransaccionPort,
  ResultadoCierreEvento,
} from '../application/ports/evento-transaccion.port';

type ClientePrisma = Prisma.TransactionClient;

@Injectable()
export class EventoTransaccionPrisma implements EventoTransaccionPort {
  constructor(private readonly prisma: PrismaService) {}

  async cerrarEvento(datos: CerrarEventoDatos): Promise<ResultadoCierreEvento> {
    return this.prisma.$transaction(async (tx) => {
      const evento = await tx.evento.findUnique({ where: { id: datos.eventoId } });
      if (!evento) {
        throw new NotFoundError('Evento no encontrado');
      }
      if (evento.estado === 'CERRADO') {
        throw new ConflictError('El evento ya se encuentra cerrado');
      }

      const ingresosManuales = await tx.ingresoEvento.groupBy({
        by: ['metodoPago'],
        where: { eventoId: datos.eventoId },
        _sum: { monto: true },
      });
      const gastosManuales = await tx.gastoEvento.groupBy({
        by: ['metodoPago'],
        where: { eventoId: datos.eventoId },
        _sum: { monto: true },
      });
      const ingresosEntradas = await tx.asignacionEntradas.groupBy({
        by: ['metodoPago'],
        where: { tipoEntrada: { eventoId: datos.eventoId } },
        _sum: { dineroRecibido: true },
      });

      const sumarMonto = (
        grupos: { metodoPago: MetodoPago | null; _sum: { monto: Prisma.Decimal | null } }[],
        metodo: MetodoPago,
      ): number => grupos.find((g) => g.metodoPago === metodo)?._sum.monto?.toNumber() ?? 0;

      const sumarDinero = (
        grupos: { metodoPago: MetodoPago | null; _sum: { dineroRecibido: Prisma.Decimal | null } }[],
        metodo: MetodoPago,
      ): number => grupos.find((g) => g.metodoPago === metodo)?._sum.dineroRecibido?.toNumber() ?? 0;

      const ingresosEfectivo =
        sumarMonto(ingresosManuales, 'EFECTIVO') + sumarDinero(ingresosEntradas, 'EFECTIVO');
      const ingresosTransferencia =
        sumarMonto(ingresosManuales, 'TRANSFERENCIA') + sumarDinero(ingresosEntradas, 'TRANSFERENCIA');
      const gastosEfectivo = sumarMonto(gastosManuales, 'EFECTIVO');
      const gastosTransferencia = sumarMonto(gastosManuales, 'TRANSFERENCIA');

      const utilidadEfectivo = ingresosEfectivo - gastosEfectivo;
      const utilidadTransferencia = ingresosTransferencia - gastosTransferencia;

      let saldoActual = await this.aplicarUtilidadOFallar(
        tx,
        'EFECTIVO',
        utilidadEfectivo,
        evento,
        datos.usuarioId,
      );
      saldoActual = await this.aplicarUtilidadOFallar(
        tx,
        'TRANSFERENCIA',
        utilidadTransferencia,
        evento,
        datos.usuarioId,
      );

      const eventoActualizado = await tx.evento.update({
        where: { id: datos.eventoId },
        data: { estado: 'CERRADO', fechaCierre: new Date() },
      });

      return {
        evento: this.eventoADominio(eventoActualizado),
        resumen: {
          ingresosEfectivo,
          ingresosTransferencia,
          gastosEfectivo,
          gastosTransferencia,
          utilidadEfectivo,
          utilidadTransferencia,
          saldoResultanteEfectivo: saldoActual.saldoEfectivo.toNumber(),
          saldoResultanteTransferencia: saldoActual.saldoTransferencia.toNumber(),
        },
      };
    });
  }

  private async aplicarUtilidadOFallar(
    tx: ClientePrisma,
    moneda: MetodoPago,
    utilidad: number,
    evento: EventoPrisma,
    usuarioId: string,
  ): Promise<SaldoGlobal> {
    if (utilidad === 0) {
      return tx.saldoGlobal.findUniqueOrThrow({ where: { id: 1 } });
    }

    let saldoActualizado: SaldoGlobal;

    if (utilidad > 0) {
      saldoActualizado = await tx.saldoGlobal.update({
        where: { id: 1 },
        data:
          moneda === 'EFECTIVO'
            ? { saldoEfectivo: { increment: utilidad } }
            : { saldoTransferencia: { increment: utilidad } },
      });
    } else {
      const monto = Math.abs(utilidad);
      const resultado = await tx.saldoGlobal.updateMany({
        where: {
          id: 1,
          ...(moneda === 'EFECTIVO'
            ? { saldoEfectivo: { gte: monto } }
            : { saldoTransferencia: { gte: monto } }),
        },
        data:
          moneda === 'EFECTIVO'
            ? { saldoEfectivo: { decrement: monto } }
            : { saldoTransferencia: { decrement: monto } },
      });

      if (resultado.count === 0) {
        throw new ConflictError(
          `Saldo insuficiente en Fondo General para absorber la pérdida del evento [${moneda === 'EFECTIVO' ? 'efectivo' : 'transferencia'}]`,
        );
      }

      saldoActualizado = await tx.saldoGlobal.findUniqueOrThrow({ where: { id: 1 } });
    }

    await tx.movimientoFondoGeneral.create({
      data: {
        usuarioId,
        tipo: 'UTILIDAD_EVENTO',
        monto: Math.abs(utilidad),
        metodoPago: moneda,
        saldoResultanteEfectivo: saldoActualizado.saldoEfectivo,
        saldoResultanteTransferencia: saldoActualizado.saldoTransferencia,
        referenciaId: evento.id,
        descripcion: `Cierre de evento "${evento.nombre}" · ${utilidad >= 0 ? 'utilidad' : 'pérdida'} en ${moneda === 'EFECTIVO' ? 'efectivo' : 'transferencia'}`,
      },
    });

    return saldoActualizado;
  }

  private eventoADominio(registro: EventoPrisma): Evento {
    return new Evento(
      registro.id,
      registro.nombre,
      registro.presupuesto ? registro.presupuesto.toNumber() : null,
      registro.estado,
      registro.fechaInicio,
      registro.fechaFin,
      registro.fechaCierre,
    );
  }
}
