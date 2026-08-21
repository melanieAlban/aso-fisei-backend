import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

interface AuditoriaStore {
  valorAnterior?: unknown;
}

@Injectable()
export class AuditoriaContextService {
  private readonly almacenamiento = new AsyncLocalStorage<AuditoriaStore>();

  ejecutarConContexto<T>(callback: () => T): T {
    return this.almacenamiento.run({}, callback);
  }

  setValorAnterior(valor: unknown): void {
    const store = this.almacenamiento.getStore();
    if (store) {
      store.valorAnterior = valor;
    }
  }

  obtenerValorAnterior(): unknown {
    return this.almacenamiento.getStore()?.valorAnterior;
  }
}
