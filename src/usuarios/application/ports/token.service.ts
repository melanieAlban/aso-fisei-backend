export interface TokenPayload {
  sub: string;
  usuario: string;
}

export interface TokenService {
  generarAccessToken(payload: TokenPayload): string;

  generarRefreshToken(payload: TokenPayload): string;

  verificarRefreshToken(token: string): TokenPayload;
}
