export type MetodoPagoAbono = 'EFECTIVO' | 'TRANSFERENCIA';

export class AbonoDeuda {
  constructor(
    public readonly id: string,
    public readonly deudaId: string,
    public readonly usuarioId: string,
    public readonly monto: number,
    public readonly metodoPago: MetodoPagoAbono,
    public readonly fecha: Date,
  ) {
    if (monto <= 0) {
      throw new Error('El monto del abono debe ser mayor a 0');
    }
  }
}
