import { AuditoriaContextService } from '../../shared/infraestructure/auditoria/auditoria-context.service';
import { ConflictError, NotFoundError } from '../../shared/domain/errors';
import { Usuario } from '../domain/usuario.entity';
import { UsuarioRepository } from '../domain/usuario.repository';

export class EditarUsuarioUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly auditoriaContexto: AuditoriaContextService,
  ) {}

  async ejecutar(datos: { usuarioId: string; nombre?: string; usuario?: string }): Promise<Usuario> {
    const usuario = await this.usuarioRepository.buscarPorId(datos.usuarioId);

    if (!usuario) {
      throw new NotFoundError('Usuario no encontrado');
    }

    this.auditoriaContexto.setValorAnterior(usuario);

    if (datos.usuario && datos.usuario !== usuario.usuario) {
      const existente = await this.usuarioRepository.buscarPorUsuario(datos.usuario);

      if (existente && existente.id !== datos.usuarioId) {
        throw new ConflictError('Ya existe un usuario con ese nombre de usuario');
      }
    }

    const usuarioActualizado = new Usuario(
      usuario.id,
      datos.nombre ?? usuario.nombre,
      datos.usuario ?? usuario.usuario,
      usuario.passwordHash,
      usuario.activo,
      usuario.fechaUltimoAcceso,
    );

    return this.usuarioRepository.guardar(usuarioActualizado);
  }
}
