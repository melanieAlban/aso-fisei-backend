import { NotFoundError } from '../../shared/domain/errors';
import { Producto } from '../domain/producto.entity';
import { ProductoRepository } from '../domain/producto.repository';

export class ObtenerProductoUseCase {
  constructor(private readonly productoRepository: ProductoRepository) {}

  async ejecutar(id: string): Promise<Producto> {
    const producto = await this.productoRepository.buscarPorId(id);

    if (!producto) {
      throw new NotFoundError('Producto no encontrado');
    }

    return producto;
  }
}
