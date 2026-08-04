import { VentaConDetalle, VentaRepository } from '../domain/venta.repository';

export class ListarVentasUseCase {
  constructor(private readonly ventaRepository: VentaRepository) {}

  async ejecutar(datos: {
    desde?: Date;
    hasta?: Date;
    page?: number;
    limit?: number;
  }): Promise<{ ventas: VentaConDetalle[]; total: number; page: number; limit: number }> {
    const page = datos.page && datos.page > 0 ? datos.page : 1;
    const limit = datos.limit && datos.limit > 0 ? datos.limit : 20;

    const { ventas, total } = await this.ventaRepository.listarTodos(
      { desde: datos.desde, hasta: datos.hasta },
      page,
      limit,
    );

    return { ventas, total, page, limit };
  }
}
