import {
  AjustarSaldoInicialDatos,
  AjusteFondoResultado,
  CajaTransaccionPort,
} from './ports/caja-transaccion.port';

export class AjustarSaldoInicialFondoUseCase {
  constructor(private readonly cajaTransaccion: CajaTransaccionPort) {}

  ejecutar(datos: AjustarSaldoInicialDatos): Promise<AjusteFondoResultado> {
    return this.cajaTransaccion.ajustarSaldoInicialFondo(datos);
  }
}
