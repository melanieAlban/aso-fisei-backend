import { MovimientoFondoGeneral } from './movimiento-fondo-general.entity';

export interface SaldoGlobalValor {
  saldoEfectivo: number;
  saldoTransferencia: number;
}

export interface FondoGeneralRepository {
  obtenerSaldo(): Promise<SaldoGlobalValor>;

  listarMovimientos(
    page: number,
    limit: number,
  ): Promise<{ movimientos: MovimientoFondoGeneral[]; total: number }>;
}
