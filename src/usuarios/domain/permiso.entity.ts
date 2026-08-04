export class Permiso {
  constructor(
    public readonly id: string,
    public readonly codigo: string,
    public readonly descripcion: string,
  ) {
    if (codigo.trim().length === 0) {
      throw new Error('El código del permiso es requerido');
    }
    if (descripcion.trim().length === 0) {
      throw new Error('La descripción del permiso es requerida');
    }
  }
}
