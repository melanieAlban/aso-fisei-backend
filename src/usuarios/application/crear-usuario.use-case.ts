import { Usuario } from '../domain/usuario.entity';
import { UsuarioRepository } from '../domain/usuario.repository';

export class CrearUsuarioUseCase {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async ejecutar(datos: {
    nombre: string;
    usuario: string;
    passwordHash: string;
  }): Promise<Usuario> {
    const existente = await this.usuarioRepository.buscarPorUsuario(datos.usuario);

    if (existente) {
      throw new Error('Ya existe un usuario con ese nombre de usuario');
    }

    const nuevoUsuario = new Usuario(
      crypto.randomUUID(),
      datos.nombre,
      datos.usuario,
      datos.passwordHash,
      true,
      null,
    );

    return this.usuarioRepository.guardar(nuevoUsuario);
  }
}