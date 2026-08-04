import { ConfiguracionSistemaRepository } from '../domain/configuracion-sistema.repository';
import { Producto } from '../domain/producto.entity';
import { ProductoRepository } from '../domain/producto.repository';

export const CLAVE_STOCK_MINIMO_GLOBAL = 'stock_minimo_global';
export const STOCK_MINIMO_POR_DEFECTO = 10;

export class ListarProductosPocoStockUseCase {
  constructor(
    private readonly productoRepository: ProductoRepository,
    private readonly configuracionRepository: ConfiguracionSistemaRepository,
  ) {}

  async ejecutar(): Promise<Producto[]> {
    const valor = await this.configuracionRepository.obtener(CLAVE_STOCK_MINIMO_GLOBAL);
    const umbral = valor ? parseInt(valor, 10) : STOCK_MINIMO_POR_DEFECTO;

    return this.productoRepository.listarConPocoStock(umbral);
  }
}
