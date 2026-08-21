import { Producto } from '../domain/producto.entity';
import { ProductoRepository } from '../domain/producto.repository';

export class CrearProductoUseCase {
  constructor(private readonly productoRepository: ProductoRepository) {}

  ejecutar(datos: {
    nombre: string;
    precioVenta?: number;
    cobraPorTiempo?: boolean;
    tarifaPorHora?: number;
  }): Promise<Producto> {
    const cobraPorTiempo = datos.cobraPorTiempo ?? false;

    const nuevoProducto = new Producto(
      crypto.randomUUID(),
      datos.nombre,
      0,
      datos.precioVenta ?? 0,
      0,
      true,
      new Date(),
      cobraPorTiempo,
      cobraPorTiempo ? (datos.tarifaPorHora ?? null) : null,
    );

    return this.productoRepository.crear(nuevoProducto);
  }
}
