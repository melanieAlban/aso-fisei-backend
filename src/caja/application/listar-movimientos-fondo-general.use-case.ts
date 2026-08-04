import { MovimientoFondoGeneral } from '../domain/movimiento-fondo-general.entity';
import { FondoGeneralRepository } from '../domain/fondo-general.repository';

export class ListarMovimientosFondoGeneralUseCase {
  constructor(private readonly fondoGeneralRepository: FondoGeneralRepository) {}

  async ejecutar(datos: {
    page?: number;
    limit?: number;
  }): Promise<{ movimientos: MovimientoFondoGeneral[]; total: number; page: number; limit: number }> {
    const page = datos.page && datos.page > 0 ? datos.page : 1;
    const limit = datos.limit && datos.limit > 0 ? datos.limit : 20;

    const { movimientos, total } = await this.fondoGeneralRepository.listarMovimientos(page, limit);

    return { movimientos, total, page, limit };
  }
}
