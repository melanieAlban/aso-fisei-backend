export class Producto {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly costoUnitario: number,
    public readonly precioVenta: number,
    public readonly stockActual: number,
    public readonly activo: boolean,
    public readonly createdAt: Date,
    public readonly cobraPorTiempo: boolean = false,
    public readonly tarifaPorHora: number | null = null,
  ) {
    if (nombre.trim().length === 0) {
      throw new Error('El nombre del producto es requerido');
    }
    // Productos que cobran por tiempo ignoran precioVenta para efectos de venta
    // (el precio se calcula desde tarifaPorHora), así que no se exige > 0 aquí.
    if (!cobraPorTiempo && precioVenta <= 0) {
      throw new Error('El precio de venta debe ser mayor a 0');
    }
    if (stockActual < 0) {
      throw new Error('El stock actual no puede ser negativo');
    }
    if (cobraPorTiempo && (tarifaPorHora === null || tarifaPorHora <= 0)) {
      throw new Error('La tarifa por hora es obligatoria y debe ser mayor a 0 cuando el producto cobra por tiempo');
    }
  }

  tienePocoStock(umbral: number): boolean {
    return this.stockActual <= umbral;
  }
}
