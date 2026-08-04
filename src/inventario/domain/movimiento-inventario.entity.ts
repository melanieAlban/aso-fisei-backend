export type TipoMovimiento = 'COMPRA' | 'VENTA' | 'PERDIDA' | 'AJUSTE';

export class MovimientoInventario {
  constructor(
    public readonly id: string,
    public readonly productoId: string,
    public readonly usuarioId: string,
    public readonly tipo: TipoMovimiento,
    public readonly cantidad: number,
    public readonly motivo: string | null,
    public readonly gastoId: string | null,
    public readonly fecha: Date,
  ) {
    if (cantidad <= 0) {
      throw new Error('La cantidad del movimiento debe ser mayor a 0');
    }
  }
}
