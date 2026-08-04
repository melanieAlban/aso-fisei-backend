import { Usuario } from './usuario.entity';

export interface UsuarioRepository {
  buscarPorUsuario(usuario: string): Promise<Usuario | null>;

  buscarPorId(id: string): Promise<Usuario | null>;

  guardar(usuario: Usuario): Promise<Usuario>;

  listarTodos(page: number, limit: number): Promise<{ usuarios: Usuario[]; total: number }>;
}
