export type MetodoPagoEvento = 'EFECTIVO' | 'TRANSFERENCIA';

export class IngresoEvento {
  constructor(
    public readonly id: string,
    public readonly eventoId: string,
    public readonly usuarioId: string,
    public readonly descripcion: string,
    public readonly monto: number,
    public readonly metodoPago: MetodoPagoEvento,
    public readonly fecha: Date,
  ) {
    if (descripcion.trim().length === 0) {
      throw new Error('La descripción del ingreso es requerida');
    }
    if (monto <= 0) {
      throw new Error('El monto del ingreso debe ser mayor a 0');
    }
  }
}
