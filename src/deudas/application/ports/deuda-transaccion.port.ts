import { AbonoDeuda, MetodoPagoAbono } from '../../domain/abono-deuda.entity';
import { Deuda } from '../../domain/deuda.entity';

export interface RegistrarAbonoDatos {
  deudaId: string;
  usuarioId: string;
  monto: number;
  metodoPago: MetodoPagoAbono;
}

export interface ResultadoAbono {
  deuda: Deuda;
  abono: AbonoDeuda;
}

export interface DeudaTransaccionPort {
  registrarAbono(datos: RegistrarAbonoDatos): Promise<ResultadoAbono>;
}
