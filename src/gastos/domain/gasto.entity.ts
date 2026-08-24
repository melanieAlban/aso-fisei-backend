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
    // Solo aplican cuando fuentePago = FONDO_GENERAL: cómo se divide el monto
    // entre las dos monedas del fondo. Para EFECTIVO_CAJA ambos quedan en 0.
    public readonly montoEfectivoFondo: number,
    public readonly montoTransferenciaFondo: number,
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
    if (montoEfectivoFondo < 0 || montoTransferenciaFondo < 0) {
      throw new Error('Los montos del Fondo General no pueden ser negativos');
    }
    if (fuentePago === 'FONDO_GENERAL') {
      const sumaCentavos = Math.round((montoEfectivoFondo + montoTransferenciaFondo) * 100);
      if (sumaCentavos !== Math.round(monto * 100)) {
        throw new Error('La suma de efectivo y transferencia del Fondo General debe ser igual al monto del gasto');
      }
    }
  }

  /** Etiqueta legible de cómo se pagó desde el Fondo General (solo informativo). */
  monedaFondo(): MonedaFondo | 'MIXTO' | null {
    if (this.fuentePago !== 'FONDO_GENERAL') return null;
    if (this.montoEfectivoFondo > 0 && this.montoTransferenciaFondo > 0) return 'MIXTO';
    if (this.montoTransferenciaFondo > 0) return 'TRANSFERENCIA';
    return 'EFECTIVO';
  }
}
