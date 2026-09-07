export type EstadoEvento = 'ACTIVO' | 'CERRADO' | 'ANULADO';

export class Evento {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly presupuesto: number | null,
    public readonly estado: EstadoEvento,
    public readonly fechaInicio: Date,
    public readonly fechaFin: Date | null,
    public readonly fechaCierre: Date | null,
    public readonly motivoAnulacion: string | null = null,
    public readonly usuarioAnulacionId: string | null = null,
  ) {
    if (nombre.trim().length === 0) {
      throw new Error('El nombre del evento es requerido');
    }
    if (presupuesto !== null && presupuesto < 0) {
      throw new Error('El presupuesto no puede ser negativo');
    }
  }
}
