export type FuentePagoValor = 'EFECTIVO_CAJA' | 'FONDO_GENERAL';
export type MonedaFondo = 'EFECTIVO' | 'TRANSFERENCIA';
export type EstadoGasto = 'ACTIVO' | 'ANULADO';

export class Gasto {
  constructor(
    public readonly id: string,
    public readonly usuarioId: string,
    public readonly descripcion: string,
    public readonly monto: number,
    public readonly categoria: string,
    public readonly fuentePago: FuentePagoValor,
    public readonly moneda: MonedaFondo | null,
    public readonly generadoAutomaticamente: boolean,
    public readonly estado: EstadoGasto,
    public readonly motivoAnulacion: string | null,
    public readonly usuarioAnulacionId: string | null,
    public readonly fecha: Date,
  ) {
    if (descripcion.trim().length === 0) {
      throw new Error('La descripción del gasto es requerida');
    }
    if (monto <= 0) {
      throw new Error('El monto del gasto debe ser mayor a 0');
    }
    if (categoria.trim().length === 0) {
      throw new Error('La categoría del gasto es requerida');
    }
  }
}
