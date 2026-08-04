import { Usuario } from '../domain/usuario.entity';
import { UsuarioRepository } from '../domain/usuario.repository';

export class DesactivarUsuarioUseCase {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async ejecutar(usuarioId: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.buscarPorId(usuarioId);

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const usuarioDesactivado = new Usuario(
      usuario.id,
      usuario.nombre,
      usuario.usuario,
      usuario.passwordHash,
      false,
      usuario.fechaUltimoAcceso,
    );

    return this.usuarioRepository.guardar(usuarioDesactivado);
  }
}
