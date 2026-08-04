import * as bcrypt from 'bcrypt';
import { UnauthorizedError } from '../../shared/domain/errors';
import { Usuario } from '../domain/usuario.entity';
import { UsuarioRepository } from '../domain/usuario.repository';
import { UsuarioRolRepository } from '../domain/usuario-rol.repository';
import { TokenService } from './ports/token.service';

export class LoginUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly tokenService: TokenService,
    private readonly usuarioRolRepository: UsuarioRolRepository,
  ) {}

  async ejecutar(datos: { usuario: string; password: string }): Promise<{
    accessToken: string;
    refreshToken: string;
    usuario: { id: string; nombre: string; usuario: string; roles: string[] };
  }> {
    const usuario = await this.usuarioRepository.buscarPorUsuario(datos.usuario);

    if (!usuario || !usuario.estaActivo()) {
      throw new UnauthorizedError('Usuario o contraseña incorrectos');
    }

    const passwordValido = await bcrypt.compare(datos.password, usuario.passwordHash);

    if (!passwordValido) {
      throw new UnauthorizedError('Usuario o contraseña incorrectos');
    }

    const usuarioActualizado = new Usuario(
      usuario.id,
      usuario.nombre,
      usuario.usuario,
      usuario.passwordHash,
      usuario.activo,
      new Date(),
    );

    await this.usuarioRepository.guardar(usuarioActualizado);

    const payload = { sub: usuario.id, usuario: usuario.usuario };
    const roles = await this.usuarioRolRepository.listarNombresRolesPorUsuario(usuario.id);

    return {
      accessToken: this.tokenService.generarAccessToken(payload),
      refreshToken: this.tokenService.generarRefreshToken(payload),
      usuario: { id: usuario.id, nombre: usuario.nombre, usuario: usuario.usuario, roles },
    };
  }
}
