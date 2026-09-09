export class TemporizadorActivo {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly horaInicio: Date,
    public readonly horaFin: Date,
    public readonly usuarioId: string,
    public readonly fecha: Date,
  ) {
    if (nombre.trim().length === 0) {
      throw new Error('El nombre es requerido');
    }
  }
}
