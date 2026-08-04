import { UsuarioPermisoExtraRepository } from '../domain/usuario-permiso-extra.repository';

export class RevocarPermisoIndividualUseCase {
  constructor(private readonly usuarioPermisoExtraRepository: UsuarioPermisoExtraRepository) {}

  async ejecutar(datos: { usuarioId: string; permisoId: string }): Promise<void> {
    await this.usuarioPermisoExtraRepository.revocar(datos.usuarioId, datos.permisoId);
  }
}
