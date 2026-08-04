import { NotFoundError } from '../../shared/domain/errors';
import { Producto } from '../domain/producto.entity';
import { ProductoRepository } from '../domain/producto.repository';

export class ActualizarProductoUseCase {
  constructor(private readonly productoRepository: ProductoRepository) {}

  async ejecutar(datos: { id: string; nombre?: string; precioVenta?: number }): Promise<Producto> {
    const producto = await this.productoRepository.buscarPorId(datos.id);

    if (!producto) {
      throw new NotFoundError('Producto no encontrado');
    }

    const productoActualizado = new Producto(
      producto.id,
      datos.nombre ?? producto.nombre,
      producto.costoUnitario,
      datos.precioVenta ?? producto.precioVenta,
      producto.stockActual,
      producto.activo,
      producto.createdAt,
    );

    return this.productoRepository.actualizar(productoActualizado);
  }
}
