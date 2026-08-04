import { NotFoundError } from '../../shared/domain/errors';
import { CajaRepository } from '../domain/caja.repository';
import { Caja } from '../domain/caja.entity';

export class ObtenerCajaActualUseCase {
  constructor(private readonly cajaRepository: CajaRepository) {}

  async ejecutar(): Promise<Caja> {
    const caja = await this.cajaRepository.buscarAbierta();

    if (!caja) {
      throw new NotFoundError('No hay ninguna caja abierta actualmente');
    }

    return caja;
  }
}
