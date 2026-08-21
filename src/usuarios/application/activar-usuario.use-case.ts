import { AuditoriaContextService } from '../../shared/infraestructure/auditoria/auditoria-context.service';
import { NotFoundError } from '../../shared/domain/errors';
import { Usuario } from '../domain/usuario.entity';
import { UsuarioRepository } from '../domain/usuario.repository';

export class ActivarUsuarioUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly auditoriaContexto: AuditoriaContextService,
  ) {}

  async ejecutar(usuarioId: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.buscarPorId(usuarioId);

    if (!usuario) {
      throw new NotFoundError('Usuario no encontrado');
    }

    this.auditoriaContexto.setValorAnterior(usuario);

    const usuarioActivado = new Usuario(
      usuario.id,
      usuario.nombre,
      usuario.usuario,
      usuario.passwordHash,
      true,
      usuario.fechaUltimoAcceso,
    );

    return this.usuarioRepository.guardar(usuarioActivado);
  }
}
