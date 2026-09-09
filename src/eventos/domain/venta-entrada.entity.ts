export type MetodoPagoVentaEntrada = 'EFECTIVO' | 'TRANSFERENCIA';

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
  }
}
