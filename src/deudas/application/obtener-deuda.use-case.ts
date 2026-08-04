import { NotFoundError } from '../../shared/domain/errors';
import { DeudaConAbonos, DeudaRepository } from '../domain/deuda.repository';

export class ObtenerDeudaUseCase {
  constructor(private readonly deudaRepository: DeudaRepository) {}

  async ejecutar(id: string): Promise<DeudaConAbonos> {
    const deuda = await this.deudaRepository.buscarPorId(id);

    if (!deuda) {
      throw new NotFoundError('Deuda no encontrada');
    }

    return deuda;
  }
}
