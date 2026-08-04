import { TokenService } from './ports/token.service';

export class RefrescarTokenUseCase {
  constructor(private readonly tokenService: TokenService) {}

  ejecutar(refreshToken: string): { accessToken: string } {
    const payload = this.tokenService.verificarRefreshToken(refreshToken);

    return {
      accessToken: this.tokenService.generarAccessToken({
        sub: payload.sub,
        usuario: payload.usuario,
      }),
    };
  }
}
