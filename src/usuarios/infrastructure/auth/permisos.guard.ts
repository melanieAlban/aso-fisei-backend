import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermisosUsuarioRepository } from '../../domain/permisos-usuario.repository';
import { UsuarioAutenticado } from './jwt-payload.interface';
import { REQUIERE_PERMISO_KEY } from './requiere-permiso.decorator';

@Injectable()
export class PermisosGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('PermisosUsuarioRepository')
    private readonly permisosUsuarioRepository: PermisosUsuarioRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const codigoPermiso = this.reflector.getAllAndOverride<string>(REQUIERE_PERMISO_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!codigoPermiso) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const usuario: UsuarioAutenticado | undefined = request.user;

    if (!usuario) {
      throw new ForbiddenException('No autenticado');
    }

    const tienePermiso = await this.permisosUsuarioRepository.usuarioTienePermiso(
      usuario.sub,
      codigoPermiso,
    );

    if (!tienePermiso) {
      throw new ForbiddenException(`No tiene el permiso requerido: ${codigoPermiso}`);
    }

    return true;
  }
}
