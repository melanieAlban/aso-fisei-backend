import { NotFoundError } from '../../shared/domain/errors';
import { UsuarioRolRepository } from '../domain/usuario-rol.repository';

export class QuitarRolUseCase {
  constructor(private readonly usuarioRolRepository: UsuarioRolRepository) {}

  async ejecutar(datos: { usuarioId: string; rolId: string }): Promise<void> {
    const existe = await this.usuarioRolRepository.existeAsignacion(datos.usuarioId, datos.rolId);

    if (!existe) {
      throw new NotFoundError('El usuario no tiene asignado ese rol');
    }

    await this.usuarioRolRepository.quitar(datos.usuarioId, datos.rolId);
  }
}
