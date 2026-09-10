import { CompromisoPagoEvento } from '../../domain/compromiso-pago-evento.entity';
import { MetodoPagoEvento } from '../../domain/ingreso-evento.entity';

export interface RegistrarAbonoCompromisoDatos {
  compromisoId: string;
  usuarioId: string;
  monto: number;
  metodoPago: MetodoPagoEvento;
}

export interface CompromisoPagoTransaccionPort {
  registrarAbono(datos: RegistrarAbonoCompromisoDatos): Promise<CompromisoPagoEvento>;
}
