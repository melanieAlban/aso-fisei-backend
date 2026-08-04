import { ArqueoCaja } from '../domain/arqueo-caja.entity';
import { CajaTransaccionPort, RealizarArqueoDatos } from './ports/caja-transaccion.port';

export class RealizarArqueoUseCase {
  constructor(private readonly cajaTransaccion: CajaTransaccionPort) {}

  ejecutar(datos: RealizarArqueoDatos): Promise<ArqueoCaja> {
    return this.cajaTransaccion.realizarArqueo(datos);
  }
}
