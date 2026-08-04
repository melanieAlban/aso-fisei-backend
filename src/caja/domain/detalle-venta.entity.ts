export type EstadoAlquiler = 'DEVUELTO' | 'PENDIENTE';
export type EstadoDetalleVenta = 'ACTIVO' | 'ANULADO';

export class DetalleVenta {
  constructor(
    public readonly id: string,
    public readonly ventaId: string,
    public readonly productoId: string,
    public readonly cantidad: number,
    public readonly precioUnitario: number,
    public readonly esAlquiler: boolean,
    public readonly estadoAlquiler: EstadoAlquiler | null,
    public readonly estado: EstadoDetalleVenta,
    public readonly motivoAnulacion: string | null,
    public readonly usuarioAnulacionId: string | null,
  ) {
    if (cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }
    if (precioUnitario < 0) {
      throw new Error('El precio unitario no puede ser negativo');
    }
  }

  subtotal(): number {
    return this.cantidad * this.precioUnitario;
  }
}
