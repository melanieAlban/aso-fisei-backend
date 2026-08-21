import { AuditoriaContextService } from '../../shared/infraestructure/auditoria/auditoria-context.service';
import { ConflictError } from '../../shared/domain/errors';
import { UsuarioRolRepository } from '../domain/usuario-rol.repository';

export class AsignarRolUseCase {
  constructor(
    private readonly usuarioRolRepository: UsuarioRolRepository,
    private readonly auditoriaContexto: AuditoriaContextService,
  ) {}

  async ejecutar(datos: { usuarioId: string; rolId: string }): Promise<void> {
    const yaExiste = await this.usuarioRolRepository.existeAsignacion(
      datos.usuarioId,
      datos.rolId,
    );

    if (yaExiste) {
      throw new ConflictError('El usuario ya tiene asignado ese rol');
    }

    const rolesAntes = await this.usuarioRolRepository.listarNombresRolesPorUsuario(
      datos.usuarioId,
    );
    this.auditoriaContexto.setValorAnterior({ roles: rolesAntes });

    await this.usuarioRolRepository.asignar(datos.usuarioId, datos.rolId);
  }
}
