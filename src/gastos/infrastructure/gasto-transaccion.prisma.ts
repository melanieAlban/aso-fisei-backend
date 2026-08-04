import { Injectable } from '@nestjs/common';
import { Gasto as GastoPrisma } from '@prisma/client';
import { ConflictError, NotFoundError } from '../../shared/domain/errors';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import { Gasto } from '../domain/gasto.entity';
import {
  AnularGastoDatos,
  GastoTransaccionPort,
  RegistrarGastoDatos,
} from '../application/ports/gasto-transaccion.port';

@Injectable()
export class GastoTransaccionPrisma implements GastoTransaccionPort {
  constructor(private readonly prisma: PrismaService) {}

  async registrarGasto(datos: RegistrarGastoDatos): Promise<Gasto> {
    return this.prisma.$transaction(async (tx) => {
      if (datos.fuentePago === 'EFECTIVO_CAJA') {
        const cajaAbierta = await tx.caja.findFirst({ where: { estado: 'ABIERTA' } });
        if (!cajaAbierta) {
          throw new ConflictError(
            'No hay caja abierta, debe abrir caja antes de registrar un gasto en efectivo de caja',
          );
        }
      }

      if (datos.fuentePago === 'FONDO_GENERAL' && !datos.moneda) {
        throw new Error(
          'Debe indicar la moneda (EFECTIVO o TRANSFERENCIA) cuando el gasto se paga desde el Fondo General',
        );
      }

      const gastoCreado = await tx.gasto.create({
        data: {
          usuarioId: datos.usuarioId,
          descripcion: datos.descripcion,
          monto: datos.monto,
          categoria: datos.categoria,
          fuentePago: datos.fuentePago,
          moneda: datos.fuentePago === 'FONDO_GENERAL' ? datos.moneda : null,
          generadoAutomaticamente: false,
        },
      });

      if (datos.fuentePago === 'FONDO_GENERAL') {
        const moneda = datos.moneda!;
        const saldoActualizado = await tx.saldoGlobal.update({
          where: { id: 1 },
          data:
            moneda === 'EFECTIVO'
              ? { saldoEfectivo: { decrement: datos.monto } }
              : { saldoTransferencia: { decrement: datos.monto } },
        });

        await tx.movimientoFondoGeneral.create({
          data: {
            usuarioId: datos.usuarioId,
            tipo: 'GASTO',
            monto: datos.monto,
            metodoPago: moneda,
            saldoResultanteEfectivo: saldoActualizado.saldoEfectivo,
            saldoResultanteTransferencia: saldoActualizado.saldoTransferencia,
            referenciaId: gastoCreado.id,
            descripcion: gastoCreado.descripcion,
          },
        });
      }

      return this.gastoADominio(gastoCreado);
    });
  }

  async anularGasto(datos: AnularGastoDatos): Promise<Gasto> {
    return this.prisma.$transaction(async (tx) => {
      const gasto = await tx.gasto.findUnique({ where: { id: datos.gastoId } });
      if (!gasto) {
        throw new NotFoundError('Gasto no encontrado');
      }
      if (gasto.estado === 'ANULADO') {
        throw new ConflictError('El gasto ya se encuentra anulado');
      }

      const gastoActualizado = await tx.gasto.update({
        where: { id: datos.gastoId },
        data: {
          estado: 'ANULADO',
          motivoAnulacion: datos.motivo,
          usuarioAnulacionId: datos.usuarioId,
        },
      });

      if (gasto.fuentePago === 'FONDO_GENERAL' && gasto.moneda) {
        const monto = gasto.monto.toNumber();

        const saldoActualizado = await tx.saldoGlobal.update({
          where: { id: 1 },
          data:
            gasto.moneda === 'EFECTIVO'
              ? { saldoEfectivo: { increment: monto } }
              : { saldoTransferencia: { increment: monto } },
        });

        await tx.movimientoFondoGeneral.create({
          data: {
            usuarioId: datos.usuarioId,
            tipo: 'GASTO',
            monto,
            metodoPago: gasto.moneda,
            saldoResultanteEfectivo: saldoActualizado.saldoEfectivo,
            saldoResultanteTransferencia: saldoActualizado.saldoTransferencia,
            referenciaId: gasto.id,
            descripcion: `Reversión por anulación de gasto: ${gasto.descripcion}`,
          },
        });
      }

      return this.gastoADominio(gastoActualizado);
    });
  }

  private gastoADominio(registro: GastoPrisma): Gasto {
    return new Gasto(
      registro.id,
      registro.usuarioId,
      registro.descripcion,
      registro.monto.toNumber(),
      registro.categoria,
      registro.fuentePago,
      registro.moneda,
      registro.generadoAutomaticamente,
      registro.estado,
      registro.motivoAnulacion,
      registro.usuarioAnulacionId,
      registro.fecha,
    );
  }
}
