import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuditoriaContextService } from './auditoria-context.service';

@Injectable()
export class AuditoriaContextMiddleware implements NestMiddleware {
  constructor(private readonly auditoriaContexto: AuditoriaContextService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    this.auditoriaContexto.ejecutarConContexto(() => next());
  }
}
