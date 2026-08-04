import { Gasto } from '../domain/gasto.entity';
import { GastoTransaccionPort, RegistrarGastoDatos } from './ports/gasto-transaccion.port';

export class RegistrarGastoUseCase {
  constructor(private readonly gastoTransaccion: GastoTransaccionPort) {}

  ejecutar(datos: RegistrarGastoDatos): Promise<Gasto> {
    return this.gastoTransaccion.registrarGasto(datos);
  }
}
