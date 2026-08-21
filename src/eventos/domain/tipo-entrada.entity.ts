export class TipoEntrada {
  constructor(
    public readonly id: string,
    public readonly eventoId: string,
    public readonly nombre: string,
    public readonly precio: number,
    public readonly cantidadTotal: number,
  ) {
    if (nombre.trim().length === 0) {
      throw new Error('El nombre del tipo de entrada es requerido');
    }
    if (precio < 0) {
      throw new Error('El precio no puede ser negativo');
    }
    if (cantidadTotal <= 0) {
      throw new Error('La cantidad total debe ser mayor a 0');
    }
  }
}
