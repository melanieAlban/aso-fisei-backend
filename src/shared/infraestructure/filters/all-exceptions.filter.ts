import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_ERROR';
    let message = 'Ocurrió un error inesperado';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      code = this.codigoDeEstado(status);
      const cuerpo = exception.getResponse();

      if (typeof cuerpo === 'string') {
        message = cuerpo;
      } else if (cuerpo && typeof cuerpo === 'object') {
        const cuerpoObjeto = cuerpo as { message?: string | string[] };
        message = Array.isArray(cuerpoObjeto.message)
          ? cuerpoObjeto.message.join(', ')
          : (cuerpoObjeto.message ?? message);
      }
    } else if (exception instanceof Error) {
      status = HttpStatus.BAD_REQUEST;
      code = 'BAD_REQUEST';
      message = exception.message;
    }

    response.status(status).json({
      success: false,
      error: { code, message },
    });
  }

  private codigoDeEstado(status: number): string {
    return HttpStatus[status] ?? 'HTTP_ERROR';
  }
}
