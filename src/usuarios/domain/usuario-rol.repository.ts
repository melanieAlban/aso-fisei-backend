export interface UsuarioRolRepository {
  existeAsignacion(usuarioId: string, rolId: string): Promise<boolean>;

  asignar(usuarioId: string, rolId: string): Promise<void>;

  listarNombresRolesPorUsuario(usuarioId: string): Promise<string[]>;
}
