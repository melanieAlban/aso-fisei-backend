import { AuditoriaContextService } from '../../shared/infraestructure/auditoria/auditoria-context.service';
import { NotFoundError } from '../../shared/domain/errors';
import { UsuarioRolRepository } from '../domain/usuario-rol.repository';

export class QuitarRolUseCase {
  constructor(
    private readonly usuarioRolRepository: UsuarioRolRepository,
    private readonly auditoriaContexto: AuditoriaContextService,
  ) {}

  async ejecutar(datos: { usuarioId: string; rolId: string }): Promise<void> {
    const existe = await this.usuarioRolRepository.existeAsignacion(datos.usuarioId, datos.rolId);

    if (!existe) {
      throw new NotFoundError('El usuario no tiene asignado ese rol');
    }

    const rolesAntes = await this.usuarioRolRepository.listarNombresRolesPorUsuario(
      datos.usuarioId,
    );
    this.auditoriaContexto.setValorAnterior({ roles: rolesAntes });

    await this.usuarioRolRepository.quitar(datos.usuarioId, datos.rolId);
  }
}
