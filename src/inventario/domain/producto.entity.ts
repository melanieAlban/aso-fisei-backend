export class Producto {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly costoUnitario: number,
    public readonly precioVenta: number,
    public readonly stockActual: number,
    public readonly activo: boolean,
    public readonly createdAt: Date,
  ) {
    if (nombre.trim().length === 0) {
      throw new Error('El nombre del producto es requerido');
    }
    if (precioVenta <= 0) {
      throw new Error('El precio de venta debe ser mayor a 0');
    }
    if (stockActual < 0) {
      throw new Error('El stock actual no puede ser negativo');
    }
  }

  tienePocoStock(umbral: number): boolean {
    return this.stockActual <= umbral;
  }
}
