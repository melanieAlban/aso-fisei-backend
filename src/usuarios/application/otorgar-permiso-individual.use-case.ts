import { UsuarioPermisoExtraRepository } from '../domain/usuario-permiso-extra.repository';

export class OtorgarPermisoIndividualUseCase {
  constructor(private readonly usuarioPermisoExtraRepository: UsuarioPermisoExtraRepository) {}

  async ejecutar(datos: {
    usuarioId: string;
    permisoId: string;
    otorgadoPorUsuarioId: string;
  }): Promise<void> {
    await this.usuarioPermisoExtraRepository.otorgar(datos);
  }
}
