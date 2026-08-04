import { NotFoundError } from '../../shared/domain/errors';
import { Usuario } from '../domain/usuario.entity';
import { UsuarioRepository } from '../domain/usuario.repository';

export class ObtenerUsuarioUseCase {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async ejecutar(usuarioId: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.buscarPorId(usuarioId);

    if (!usuario) {
      throw new NotFoundError('Usuario no encontrado');
    }

    return usuario;
  }
}
