import { MetodoPago, Prisma, SaldoGlobal, TipoMovimientoFondo } from '@prisma/client';
import { ConflictError } from '../../domain/errors';

type ClientePrisma = Prisma.TransactionClient;

async function decrementarMonedaOFallar(
  tx: ClientePrisma,
  moneda: MetodoPago,
  monto: number,
): Promise<SaldoGlobal> {
  const resultado = await tx.saldoGlobal.updateMany({
    where: {
      id: 1,
      ...(moneda === 'EFECTIVO' ? { saldoEfectivo: { gte: monto } } : { saldoTransferencia: { gte: monto } }),
    },
    data:
      moneda === 'EFECTIVO'
        ? { saldoEfectivo: { decrement: monto } }
        : { saldoTransferencia: { decrement: monto } },
  });

  if (resultado.count === 0) {
    throw new ConflictError(
      `Saldo insuficiente en Fondo General [${moneda === 'EFECTIVO' ? 'efectivo' : 'transferencia'}]`,
    );
  }

  return tx.saldoGlobal.findUniqueOrThrow({ where: { id: 1 } });
}

function incrementarMoneda(tx: ClientePrisma, moneda: MetodoPago, monto: number): Promise<SaldoGlobal> {
  return tx.saldoGlobal.update({
    where: { id: 1 },
    data:
      moneda === 'EFECTIVO' ? { saldoEfectivo: { increment: monto } } : { saldoTransferencia: { increment: monto } },
  });
}

export interface SplitFondoGeneralDatos {
  usuarioId: string;
  tipo: TipoMovimientoFondo;
  montoEfectivo: number;
  montoTransferencia: number;
  direccion: 'DECREMENTO' | 'INCREMENTO';
  referenciaId?: string;
  descripcion?: string;
}

/**
 * Aplica un movimiento de Fondo General potencialmente dividido entre efectivo
 * y transferencia (ej. una compra o gasto pagado en parte con cada moneda).
 * Cada moneda con monto > 0 se aplica y registra como un MovimientoFondoGeneral
 * independiente, en la misma transacción — si la segunda moneda falla por
 * saldo insuficiente, la primera se revierte junto con todo lo demás.
 */
export async function aplicarSplitFondoGeneralOFallar(
  tx: ClientePrisma,
  datos: SplitFondoGeneralDatos,
): Promise<SaldoGlobal> {
  let saldo = await tx.saldoGlobal.findUniqueOrThrow({ where: { id: 1 } });

  const legs: [MetodoPago, number][] = [
    ['EFECTIVO', datos.montoEfectivo],
    ['TRANSFERENCIA', datos.montoTransferencia],
  ];

  for (const [moneda, monto] of legs) {
    if (monto <= 0) continue;

    saldo =
      datos.direccion === 'DECREMENTO'
        ? await decrementarMonedaOFallar(tx, moneda, monto)
        : await incrementarMoneda(tx, moneda, monto);

    await tx.movimientoFondoGeneral.create({
      data: {
        usuarioId: datos.usuarioId,
        tipo: datos.tipo,
        monto,
        metodoPago: moneda,
        saldoResultanteEfectivo: saldo.saldoEfectivo,
        saldoResultanteTransferencia: saldo.saldoTransferencia,
        referenciaId: datos.referenciaId,
        descripcion: datos.descripcion,
      },
    });
  }

  return saldo;
}
