export interface PermisosUsuarioRepository {
  usuarioTienePermiso(usuarioId: string, codigoPermiso: string): Promise<boolean>;
}
