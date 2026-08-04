export type TipoDeuda = 'POR_COBRAR' | 'POR_PAGAR';
export type EstadoDeuda = 'PENDIENTE' | 'PARCIAL' | 'CANCELADA';

export class Deuda {
  constructor(
    public readonly id: string,
    public readonly usuarioId: string,
    public readonly gastoId: string | null,
    public readonly tipo: TipoDeuda,
    public readonly contraparte: string,
    public readonly montoTotal: number,
    public readonly montoAbonado: number,
    public readonly estado: EstadoDeuda,
    public readonly fechaRegistro: Date,
  ) {
    if (contraparte.trim().length === 0) {
      throw new Error('La contraparte de la deuda es requerida');
    }
    if (montoTotal <= 0) {
      throw new Error('El monto total de la deuda debe ser mayor a 0');
    }
    if (montoAbonado < 0) {
      throw new Error('El monto abonado no puede ser negativo');
    }
    if (montoAbonado > montoTotal) {
      throw new Error('El monto abonado no puede exceder el monto total');
    }
  }

  saldoPendiente(): number {
    return this.montoTotal - this.montoAbonado;
  }
}
