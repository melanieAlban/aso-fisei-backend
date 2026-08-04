import { Gasto } from '../domain/gasto.entity';
import { GastoRepository } from '../domain/gasto.repository';

export class ListarGastosUseCase {
  constructor(private readonly gastoRepository: GastoRepository) {}

  async ejecutar(datos: {
    categoria?: string;
    desde?: Date;
    hasta?: Date;
    page?: number;
    limit?: number;
  }): Promise<{ gastos: Gasto[]; total: number; page: number; limit: number }> {
    const page = datos.page && datos.page > 0 ? datos.page : 1;
    const limit = datos.limit && datos.limit > 0 ? datos.limit : 20;

    const { gastos, total } = await this.gastoRepository.listarTodos(
      { categoria: datos.categoria, desde: datos.desde, hasta: datos.hasta },
      page,
      limit,
    );

    return { gastos, total, page, limit };
  }
}
