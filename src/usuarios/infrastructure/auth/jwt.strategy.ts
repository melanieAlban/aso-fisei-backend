import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuarioRepository } from '../../domain/usuario.repository';
import { JwtPayload, UsuarioAutenticado } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @Inject('UsuarioRepository') private readonly usuarioRepository: UsuarioRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<UsuarioAutenticado> {
    const usuario = await this.usuarioRepository.buscarPorId(payload.sub);

    if (!usuario || !usuario.estaActivo()) {
      throw new UnauthorizedException('Usuario inválido o inactivo');
    }

    return { sub: payload.sub, usuario: payload.usuario };
  }
}
