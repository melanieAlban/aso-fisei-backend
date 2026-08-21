import { MetodoPagoEvento } from './ingreso-evento.entity';

export class GastoEvento {
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
      throw new Error('La descripción del gasto es requerida');
    }
    if (monto <= 0) {
      throw new Error('El monto del gasto debe ser mayor a 0');
    }
  }
}
