import { Injectable } from '@nestjs/common';
import { AbonoDeuda as AbonoPrisma, Deuda as DeudaPrisma } from '@prisma/client';
import { ConflictError, NotFoundError } from '../../shared/domain/errors';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import { AbonoDeuda } from '../domain/abono-deuda.entity';
import { Deuda, EstadoDeuda } from '../domain/deuda.entity';
import {
  DeudaTransaccionPort,
  RegistrarAbonoDatos,
  ResultadoAbono,
} from '../application/ports/deuda-transaccion.port';

@Injectable()
export class DeudaTransaccionPrisma implements DeudaTransaccionPort {
  constructor(private readonly prisma: PrismaService) {}

  async registrarAbono(datos: RegistrarAbonoDatos): Promise<ResultadoAbono> {
    return this.prisma.$transaction(async (tx) => {
      const deuda = await tx.deuda.findUnique({ where: { id: datos.deudaId } });
      if (!deuda) {
        throw new NotFoundError('Deuda no encontrada');
      }
      if (deuda.estado === 'CANCELADA') {
        throw new ConflictError('La deuda ya se encuentra cancelada');
      }

      const montoTotal = deuda.montoTotal.toNumber();
      const montoAbonadoActual = deuda.montoAbonado.toNumber();
      const saldoPendiente = montoTotal - montoAbonadoActual;

      if (datos.monto > saldoPendiente) {
        throw new ConflictError(
          `El monto del abono (${datos.monto}) excede el saldo pendiente (${saldoPendiente})`,
        );
      }

      const nuevoMontoAbonado = montoAbonadoActual + datos.monto;
      const nuevoEstado: EstadoDeuda =
        nuevoMontoAbonado >= montoTotal ? 'CANCELADA' : nuevoMontoAbonado > 0 ? 'PARCIAL' : 'PENDIENTE';

      const deudaActualizada = await tx.deuda.update({
        where: { id: datos.deudaId },
        data: { montoAbonado: nuevoMontoAbonado, estado: nuevoEstado },
      });

      const abonoCreado = await tx.abonoDeuda.create({
        data: {
          deudaId: datos.deudaId,
          usuarioId: datos.usuarioId,
          monto: datos.monto,
          metodoPago: datos.metodoPago,
        },
      });

      const esCobro = deuda.tipo === 'POR_COBRAR';
      const delta = esCobro ? datos.monto : -datos.monto;

      const saldoActualizado = await tx.saldoGlobal.update({
        where: { id: 1 },
        data:
          datos.metodoPago === 'EFECTIVO'
            ? { saldoEfectivo: { increment: delta } }
            : { saldoTransferencia: { increment: delta } },
      });

      await tx.movimientoFondoGeneral.create({
        data: {
          usuarioId: datos.usuarioId,
          tipo: esCobro ? 'ABONO_DEUDA_RECIBIDO' : 'ABONO_DEUDA_PAGADO',
          monto: datos.monto,
          metodoPago: datos.metodoPago,
          saldoResultanteEfectivo: saldoActualizado.saldoEfectivo,
          saldoResultanteTransferencia: saldoActualizado.saldoTransferencia,
          referenciaId: datos.deudaId,
          descripcion: `Abono a deuda ${esCobro ? 'por cobrar' : 'por pagar'} - ${deuda.contraparte}`,
        },
      });

      return {
        deuda: this.deudaADominio(deudaActualizada),
        abono: this.abonoADominio(abonoCreado),
      };
    });
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
