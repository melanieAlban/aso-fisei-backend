import { AuditoriaContextService } from '../../shared/infraestructure/auditoria/auditoria-context.service';
import { UsuarioPermisoExtraRepository } from '../domain/usuario-permiso-extra.repository';

export class OtorgarPermisoIndividualUseCase {
  constructor(
    private readonly usuarioPermisoExtraRepository: UsuarioPermisoExtraRepository,
    private readonly auditoriaContexto: AuditoriaContextService,
  ) {}

  async ejecutar(datos: {
    usuarioId: string;
    permisoId: string;
    otorgadoPorUsuarioId: string;
  }): Promise<void> {
    const permisosAntes = await this.usuarioPermisoExtraRepository.listarCodigosPermisosExtraPorUsuario(
      datos.usuarioId,
    );
    this.auditoriaContexto.setValorAnterior({ permisosExtra: permisosAntes });

    await this.usuarioPermisoExtraRepository.otorgar(datos);
  }
}
