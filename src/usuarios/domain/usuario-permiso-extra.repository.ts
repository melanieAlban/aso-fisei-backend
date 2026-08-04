export interface UsuarioPermisoExtraRepository {
  otorgar(datos: {
    usuarioId: string;
    permisoId: string;
    otorgadoPorUsuarioId: string;
  }): Promise<void>;

  revocar(usuarioId: string, permisoId: string): Promise<void>;
}
