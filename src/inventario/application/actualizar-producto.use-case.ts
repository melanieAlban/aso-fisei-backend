import { AuditoriaContextService } from '../../shared/infraestructure/auditoria/auditoria-context.service';
import { NotFoundError } from '../../shared/domain/errors';
import { Producto } from '../domain/producto.entity';
import { ProductoRepository } from '../domain/producto.repository';

export class ActualizarProductoUseCase {
  constructor(
    private readonly productoRepository: ProductoRepository,
    private readonly auditoriaContexto: AuditoriaContextService,
  ) {}

  async ejecutar(datos: {
    id: string;
    nombre?: string;
    precioVenta?: number;
    cobraPorTiempo?: boolean;
    tarifaPorHora?: number;
  }): Promise<Producto> {
    const producto = await this.productoRepository.buscarPorId(datos.id);

    if (!producto) {
      throw new NotFoundError('Producto no encontrado');
    }

    this.auditoriaContexto.setValorAnterior(producto);

    const cobraPorTiempo = datos.cobraPorTiempo ?? producto.cobraPorTiempo;

    const productoActualizado = new Producto(
      producto.id,
      datos.nombre ?? producto.nombre,
      producto.costoUnitario,
      datos.precioVenta ?? producto.precioVenta,
      producto.stockActual,
      producto.activo,
      producto.createdAt,
      cobraPorTiempo,
      cobraPorTiempo ? (datos.tarifaPorHora ?? producto.tarifaPorHora) : null,
    );

    return this.productoRepository.actualizar(productoActualizado);
  }
}
