import { ConflictError } from '../../shared/domain/errors';
import { UsuarioRolRepository } from '../domain/usuario-rol.repository';

export class AsignarRolUseCase {
  constructor(private readonly usuarioRolRepository: UsuarioRolRepository) {}

  async ejecutar(datos: { usuarioId: string; rolId: string }): Promise<void> {
    const yaExiste = await this.usuarioRolRepository.existeAsignacion(
      datos.usuarioId,
      datos.rolId,
    );

    if (yaExiste) {
      throw new ConflictError('El usuario ya tiene asignado ese rol');
    }

    await this.usuarioRolRepository.asignar(datos.usuarioId, datos.rolId);
  }
}
