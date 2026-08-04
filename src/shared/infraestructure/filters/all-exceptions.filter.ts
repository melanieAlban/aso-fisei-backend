import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { ConflictError, NotFoundError, UnauthorizedError } from '../../domain/errors';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

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
    } else if (exception instanceof NotFoundError) {
      status = HttpStatus.NOT_FOUND;
      code = 'NOT_FOUND';
      message = exception.message;
    } else if (exception instanceof ConflictError) {
      status = HttpStatus.CONFLICT;
      code = 'CONFLICT';
      message = exception.message;
    } else if (exception instanceof UnauthorizedError) {
      status = HttpStatus.UNAUTHORIZED;
      code = 'UNAUTHORIZED';
      message = exception.message;
    } else if (this.esErrorDePrisma(exception)) {
      this.logger.error('Error de base de datos no controlado', exception as Error);
    } else if (exception instanceof Error) {
      status = HttpStatus.BAD_REQUEST;
      code = 'BAD_REQUEST';
      message = exception.message;
    } else {
      this.logger.error('Excepción no controlada', exception as Error);
    }

    response.status(status).json({
      success: false,
      error: { code, message },
    });
  }

  private esErrorDePrisma(exception: unknown): boolean {
    return (
      exception instanceof Prisma.PrismaClientKnownRequestError ||
      exception instanceof Prisma.PrismaClientValidationError ||
      exception instanceof Prisma.PrismaClientInitializationError ||
      exception instanceof Prisma.PrismaClientUnknownRequestError ||
      exception instanceof Prisma.PrismaClientRustPanicError
    );
  }

  private codigoDeEstado(status: number): string {
    return HttpStatus[status] ?? 'HTTP_ERROR';
  }
}
