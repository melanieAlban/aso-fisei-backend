import * as bcrypt from 'bcrypt';
import { Usuario } from '../domain/usuario.entity';
import { UsuarioRepository } from '../domain/usuario.repository';

const SALT_ROUNDS = 10;

export class CambiarPasswordUseCase {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async ejecutar(datos: { usuarioId: string; nuevoPassword: string }): Promise<Usuario> {
    const usuario = await this.usuarioRepository.buscarPorId(datos.usuarioId);

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const passwordHash = await bcrypt.hash(datos.nuevoPassword, SALT_ROUNDS);

    const usuarioActualizado = new Usuario(
      usuario.id,
      usuario.nombre,
      usuario.usuario,
      passwordHash,
      usuario.activo,
      usuario.fechaUltimoAcceso,
    );

    return this.usuarioRepository.guardar(usuarioActualizado);
  }
}
