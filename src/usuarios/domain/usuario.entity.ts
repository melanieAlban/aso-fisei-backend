export class Usuario {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly usuario: string,
    public readonly passwordHash: string,
    public readonly activo: boolean,
    public readonly fechaUltimoAcceso: Date | null,
  ) {
    if(nombre.trim().length === 0) {
      throw new Error('El nombre es requerido');
    }

    if(usuario.trim().length === 0) {
      throw new Error('El nombre de usuario es requerido');
    }
  }

  estaActivo(): boolean {
        return this.activo;
  }
}