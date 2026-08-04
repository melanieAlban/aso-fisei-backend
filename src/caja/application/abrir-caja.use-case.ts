import { Caja } from '../domain/caja.entity';
import { AbrirCajaDatos, CajaTransaccionPort } from './ports/caja-transaccion.port';

export class AbrirCajaUseCase {
  constructor(private readonly cajaTransaccion: CajaTransaccionPort) {}

  ejecutar(datos: AbrirCajaDatos): Promise<Caja> {
    return this.cajaTransaccion.abrirCaja(datos);
  }
}
