import { MovimientoInventario } from '../../domain/movimiento-inventario.entity';
import { Producto } from '../../domain/producto.entity';

export type FuentePagoValor = 'EFECTIVO_CAJA' | 'FONDO_GENERAL';
export type DireccionAjuste = 'INCREMENTO' | 'DECREMENTO';

export interface RegistrarCompraDatos {
  productoId: string;
  usuarioId: string;
  cantidad: number;
  costoUnitario: number;
  fuentePago: FuentePagoValor;
}

export interface RegistrarPerdidaDatos {
  productoId: string;
  usuarioId: string;
  cantidad: number;
  motivo: string;
}

export interface RegistrarAjusteDatos {
  productoId: string;
  usuarioId: string;
  cantidad: number;
  direccion: DireccionAjuste;
  motivo?: string;
}

export interface ResultadoMovimiento {
  movimiento: MovimientoInventario;
  producto: Producto;
}

export interface InventarioTransaccionPort {
  registrarCompra(datos: RegistrarCompraDatos): Promise<ResultadoMovimiento>;

  registrarPerdida(datos: RegistrarPerdidaDatos): Promise<ResultadoMovimiento>;

  registrarAjuste(datos: RegistrarAjusteDatos): Promise<ResultadoMovimiento>;
}
