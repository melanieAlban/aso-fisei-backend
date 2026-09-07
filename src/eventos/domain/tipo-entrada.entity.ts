export class TipoEntrada {
  constructor(
    public readonly id: string,
    public readonly eventoId: string,
    public readonly nombre: string,
    public readonly precio: number,
    public readonly cantidadTotal: number,
    public readonly precioCombo: number | null = null,
    public readonly cantidadCombo: number | null = null,
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
    const tieneCombo = precioCombo !== null || cantidadCombo !== null;
    if (tieneCombo) {
      if (precioCombo === null || precioCombo <= 0) {
        throw new Error('El precio del combo debe ser mayor a 0');
      }
      if (cantidadCombo === null || cantidadCombo < 2) {
        throw new Error('La cantidad de entradas por combo debe ser al menos 2');
      }
    }
  }
}
