import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export interface RespuestaEstandar<T> {
  success: true;
  data: T;
  meta: { timestamp: string };
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, RespuestaEstandar<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<RespuestaEstandar<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true as const,
        data: data ?? (null as unknown as T),
        meta: { timestamp: new Date().toISOString() },
      })),
    );
  }
}
