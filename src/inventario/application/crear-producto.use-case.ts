import { Producto } from '../domain/producto.entity';
import { ProductoRepository } from '../domain/producto.repository';

export class CrearProductoUseCase {
  constructor(private readonly productoRepository: ProductoRepository) {}

  ejecutar(datos: { nombre: string; precioVenta: number }): Promise<Producto> {
    const nuevoProducto = new Producto(
      crypto.randomUUID(),
      datos.nombre,
      0,
      datos.precioVenta,
      0,
      true,
      new Date(),
    );

    return this.productoRepository.crear(nuevoProducto);
  }
}
