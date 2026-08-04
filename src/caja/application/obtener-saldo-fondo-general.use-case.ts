import { FondoGeneralRepository, SaldoGlobalValor } from '../domain/fondo-general.repository';

export class ObtenerSaldoFondoGeneralUseCase {
  constructor(private readonly fondoGeneralRepository: FondoGeneralRepository) {}

  ejecutar(): Promise<SaldoGlobalValor> {
    return this.fondoGeneralRepository.obtenerSaldo();
  }
}
