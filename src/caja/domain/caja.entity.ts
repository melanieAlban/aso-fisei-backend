export type EstadoCaja = 'ABIERTA' | 'CERRADA';

export class Caja {
  constructor(
    public readonly id: string,
    public readonly usuarioAperturaId: string,
    public readonly usuarioCierreId: string | null,
    public readonly fondoInicialEfectivo: number,
    public readonly estado: EstadoCaja,
    public readonly fechaApertura: Date,
    public readonly fechaCierre: Date | null,
  ) {
    if (fondoInicialEfectivo < 0) {
      throw new Error('El fondo inicial de efectivo no puede ser negativo');
    }
  }

  estaAbierta(): boolean {
    return this.estado === 'ABIERTA';
  }
}
