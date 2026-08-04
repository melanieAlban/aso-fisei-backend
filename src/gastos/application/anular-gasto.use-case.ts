import { Gasto } from '../domain/gasto.entity';
import { AnularGastoDatos, GastoTransaccionPort } from './ports/gasto-transaccion.port';

export class AnularGastoUseCase {
  constructor(private readonly gastoTransaccion: GastoTransaccionPort) {}

  ejecutar(datos: AnularGastoDatos): Promise<Gasto> {
    return this.gastoTransaccion.anularGasto(datos);
  }
}
