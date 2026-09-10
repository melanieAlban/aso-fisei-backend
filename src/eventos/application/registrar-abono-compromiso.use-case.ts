import { CompromisoPagoEvento } from '../domain/compromiso-pago-evento.entity';
import {
  CompromisoPagoTransaccionPort,
  RegistrarAbonoCompromisoDatos,
} from './ports/compromiso-pago-transaccion.port';

export class RegistrarAbonoCompromisoUseCase {
  constructor(private readonly transaccion: CompromisoPagoTransaccionPort) {}

  ejecutar(datos: RegistrarAbonoCompromisoDatos): Promise<CompromisoPagoEvento> {
    return this.transaccion.registrarAbono(datos);
  }
}
