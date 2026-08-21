import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { AuditoriaContextService } from './auditoria-context.service';

const METODOS_AUDITADOS = ['POST', 'PATCH', 'DELETE', 'PUT'];
const CAMPOS_SENSIBLES = ['password', 'passwordHash', 'accessToken', 'refreshToken', 'nuevoPassword'];

@Injectable()
export class AuditoriaInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditoriaInterceptor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditoriaContexto: AuditoriaContextService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();

    if (!METODOS_AUDITADOS.includes(request.method)) {
      return next.handle();
    }

    return next.handle().pipe(
      tap((data) => {
        this.registrar(request, data).catch((error) => {
          this.logger.error('No se pudo registrar la auditoría', error);
        });
      }),
    );
  }

  private async registrar(request: any, data: unknown): Promise<void> {
    const usuarioId = request.user?.sub ?? this.extraerUsuarioId(data) ?? null;
    const modulo = this.extraerModulo(request.path ?? request.url ?? '');
    const accion = `${request.method} ${request.route?.path ?? request.path}`;
    const valorAnterior = this.auditoriaContexto.obtenerValorAnterior();

    await this.prisma.auditoria.create({
      data: {
        usuarioId,
        modulo,
        accion,
        registroAfectado: request.params?.id ?? null,
        valorAnterior: this.sanitizar(valorAnterior),
        valorNuevo: this.sanitizar(data),
        fecha: new Date(),
      },
    });
  }

  private extraerUsuarioId(data: unknown): string | null {
    if (data && typeof data === 'object') {
      const registro = data as Record<string, any>;
      return registro.usuario?.id ?? registro.id ?? null;
    }
    return null;
  }

  private extraerModulo(path: string): string {
    const segmentos = path.split('/').filter(Boolean).filter((s) => s !== 'api' && s !== 'v1');
    return segmentos[0] ?? 'desconocido';
  }

  private sanitizar(data: unknown): any {
    if (!data || typeof data !== 'object') {
      return data ?? undefined;
    }

    const copia: Record<string, any> = { ...(data as Record<string, any>) };
    for (const campo of CAMPOS_SENSIBLES) {
      delete copia[campo];
    }
    return copia;
  }
}
