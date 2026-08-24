export type MetodoPago = 'EFECTIVO' | 'TRANSFERENCIA';

export class Venta {
  constructor(
    public readonly id: string,
    public readonly usuarioId: string,
    public readonly cajaId: string,
    // Informativo/derivado: EFECTIVO o TRANSFERENCIA si la venta se pagó
    // enteramente en una moneda, null si fue pago mixto — montoEfectivo/
    // montoTransferencia son la fuente de verdad para caja y reportes.
    public readonly metodoPago: MetodoPago | null,
    public readonly montoEfectivo: number,
    public readonly montoTransferencia: number,
    public readonly total: number,
    public readonly fecha: Date,
  ) {
    if (total < 0) {
      throw new Error('El total de la venta no puede ser negativo');
    }
    if (montoEfectivo < 0 || montoTransferencia < 0) {
      throw new Error('Los montos de pago no pueden ser negativos');
    }
    const sumaCentavos = Math.round((montoEfectivo + montoTransferencia) * 100);
    if (sumaCentavos !== Math.round(total * 100)) {
      throw new Error('La suma de efectivo y transferencia debe ser igual al total de la venta');
    }
  }
}
