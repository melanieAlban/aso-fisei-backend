import { CajaRepository } from '../domain/caja.repository';
import { ResumenDiario, VentaRepository } from '../domain/venta.repository';

export class ResumenDiarioUseCase {
  constructor(
    private readonly cajaRepository: CajaRepository,
    private readonly ventaRepository: VentaRepository,
  ) {}

  async ejecutar(cajaId: string): Promise<ResumenDiario[]> {
    const caja = await this.cajaRepository.buscarPorId(cajaId);

    if (!caja) {
      throw new Error('Caja no encontrada');
    }

    return this.ventaRepository.resumenDiarioPorCaja(cajaId);
  }
}
