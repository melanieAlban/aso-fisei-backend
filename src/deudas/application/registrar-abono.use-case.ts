import { DeudaTransaccionPort, RegistrarAbonoDatos, ResultadoAbono } from './ports/deuda-transaccion.port';

export class RegistrarAbonoUseCase {
  constructor(private readonly deudaTransaccion: DeudaTransaccionPort) {}

  ejecutar(datos: RegistrarAbonoDatos): Promise<ResultadoAbono> {
    return this.deudaTransaccion.registrarAbono(datos);
  }
}
