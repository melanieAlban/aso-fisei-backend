export type MetodoPagoVentaEntrada = 'EFECTIVO' | 'TRANSFERENCIA' | null;

export class VentaEntrada {
  constructor(
    public readonly id: string,
    public readonly tipoEntradaId: string,
    public readonly usuarioId: string,
    public readonly cantidad: number,
    public readonly cantidadCombo: number,
    public readonly monto: number,
    public readonly metodoPago: MetodoPagoVentaEntrada,
    public readonly fecha: Date,
    public readonly montoEfectivo: number = 0,
    public readonly montoTransferencia: number = 0,
  ) {
    if (cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }
    if (cantidadCombo < 0 || cantidadCombo > cantidad) {
      throw new Error('La cantidad en combo no puede exceder la cantidad vendida');
    }
    if (monto < 0) {
      throw new Error('El monto no puede ser negativo');
    }
    if (montoEfectivo < 0 || montoTransferencia < 0) {
      throw new Error('Los montos de efectivo y transferencia no pueden ser negativos');
    }
    if (Math.round((montoEfectivo + montoTransferencia) * 100) !== Math.round(monto * 100)) {
      throw new Error('La suma de efectivo y transferencia debe ser igual al monto de la venta');
    }
  }
}
