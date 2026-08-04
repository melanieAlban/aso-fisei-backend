import { Producto } from '../domain/producto.entity';
import { ProductoRepository } from '../domain/producto.repository';

export class ListarProductosUseCase {
  constructor(private readonly productoRepository: ProductoRepository) {}

  async ejecutar(datos: {
    page?: number;
    limit?: number;
  }): Promise<{ productos: Producto[]; total: number; page: number; limit: number }> {
    const page = datos.page && datos.page > 0 ? datos.page : 1;
    const limit = datos.limit && datos.limit > 0 ? datos.limit : 20;

    const { productos, total } = await this.productoRepository.listarTodos(page, limit);

    return { productos, total, page, limit };
  }
}
