import { Injectable } from '@nestjs/common';
import { Gasto as GastoPrisma } from '@prisma/client';
import { ConflictError, NotFoundError } from '../../shared/domain/errors';
import { aplicarSplitFondoGeneralOFallar } from '../../shared/infraestructure/fondo-general/fondo-general.util';
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

      const montoEfectivoFondo = datos.montoEfectivoFondo ?? 0;
      const montoTransferenciaFondo = datos.montoTransferenciaFondo ?? 0;

      if (datos.fuentePago === 'FONDO_GENERAL') {
        const sumaCentavos = Math.round((montoEfectivoFondo + montoTransferenciaFondo) * 100);
        if (sumaCentavos !== Math.round(datos.monto * 100)) {
          throw new Error(
            'La suma de efectivo y transferencia del Fondo General debe ser igual al monto del gasto',
          );
        }
      }

      const gastoCreado = await tx.gasto.create({
        data: {
          usuarioId: datos.usuarioId,
          descripcion: datos.descripcion,
          monto: datos.monto,
          categoria: datos.categoria,
          fuentePago: datos.fuentePago,
          montoEfectivoFondo: datos.fuentePago === 'FONDO_GENERAL' ? montoEfectivoFondo : 0,
          montoTransferenciaFondo: datos.fuentePago === 'FONDO_GENERAL' ? montoTransferenciaFondo : 0,
          generadoAutomaticamente: false,
        },
      });

      if (datos.fuentePago === 'FONDO_GENERAL') {
        await aplicarSplitFondoGeneralOFallar(tx, {
          usuarioId: datos.usuarioId,
          tipo: 'GASTO',
          montoEfectivo: montoEfectivoFondo,
          montoTransferencia: montoTransferenciaFondo,
          direccion: 'DECREMENTO',
          referenciaId: gastoCreado.id,
          descripcion: gastoCreado.descripcion,
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

      if (gasto.fuentePago === 'FONDO_GENERAL') {
        await aplicarSplitFondoGeneralOFallar(tx, {
          usuarioId: datos.usuarioId,
          tipo: 'GASTO',
          montoEfectivo: gasto.montoEfectivoFondo.toNumber(),
          montoTransferencia: gasto.montoTransferenciaFondo.toNumber(),
          direccion: 'INCREMENTO',
          referenciaId: gasto.id,
          descripcion: `Reversión por anulación de gasto: ${gasto.descripcion}`,
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
      registro.montoEfectivoFondo.toNumber(),
      registro.montoTransferenciaFondo.toNumber(),
      registro.generadoAutomaticamente,
      registro.estado,
      registro.motivoAnulacion,
      registro.usuarioAnulacionId,
      registro.fecha,
    );
  }
}
