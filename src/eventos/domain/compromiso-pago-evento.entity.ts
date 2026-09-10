export class CompromisoPagoEvento {
  constructor(
    public readonly id: string,
    public readonly eventoId: string,
    public readonly descripcion: string,
    public readonly montoTotal: number,
    public readonly montoPagado: number,
    public readonly fecha: Date,
  ) {
    if (descripcion.trim().length === 0) {
      throw new Error('La descripción es requerida');
    }
    if (montoTotal <= 0) {
      throw new Error('El monto total debe ser mayor a 0');
    }
    if (montoPagado < 0) {
      throw new Error('El monto pagado no puede ser negativo');
    }
    if (Math.round(montoPagado * 100) > Math.round(montoTotal * 100)) {
      throw new Error('El monto pagado no puede exceder el monto total');
    }
  }

  get montoPendiente(): number {
    return Math.round((this.montoTotal - this.montoPagado) * 100) / 100;
  }
}
