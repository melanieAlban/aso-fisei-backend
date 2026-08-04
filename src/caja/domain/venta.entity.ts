export type MetodoPago = 'EFECTIVO' | 'TRANSFERENCIA';

export class Venta {
  constructor(
    public readonly id: string,
    public readonly usuarioId: string,
    public readonly cajaId: string,
    public readonly metodoPago: MetodoPago,
    public readonly total: number,
    public readonly fecha: Date,
  ) {
    if (total < 0) {
      throw new Error('El total de la venta no puede ser negativo');
    }
  }
}
