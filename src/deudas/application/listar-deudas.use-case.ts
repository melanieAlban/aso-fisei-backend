import { DeudaConAbonos, DeudaRepository, FiltrosDeudas } from '../domain/deuda.repository';

export class ListarDeudasUseCase {
  constructor(private readonly deudaRepository: DeudaRepository) {}

  async ejecutar(
    datos: FiltrosDeudas & { page?: number; limit?: number },
  ): Promise<{ deudas: DeudaConAbonos[]; total: number; page: number; limit: number }> {
    const page = datos.page && datos.page > 0 ? datos.page : 1;
    const limit = datos.limit && datos.limit > 0 ? datos.limit : 20;

    const { deudas, total } = await this.deudaRepository.listarTodos(
      { tipo: datos.tipo, estado: datos.estado },
      page,
      limit,
    );

    return { deudas, total, page, limit };
  }
}
