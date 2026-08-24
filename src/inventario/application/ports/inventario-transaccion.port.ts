import { MovimientoInventario } from '../../domain/movimiento-inventario.entity';
import { Producto } from '../../domain/producto.entity';

export type FuentePagoValor = 'EFECTIVO_CAJA' | 'FONDO_GENERAL';
export type DireccionAjuste = 'INCREMENTO' | 'DECREMENTO';
export type MonedaFondo = 'EFECTIVO' | 'TRANSFERENCIA';

export interface RegistrarCompraDatos {
  productoId: string;
  usuarioId: string;
  cantidad: number;
  /** Opcional: productos sin costo de adquisición real (copias, servicios) se registran en 0. */
  costoUnitario?: number;
  fuentePago: FuentePagoValor;
  /**
   * Solo aplican cuando fuentePago es FONDO_GENERAL: cómo se divide el costo
   * entre las dos monedas del fondo (pueden ser ambas > 0 para un pago mixto).
   * Se ignoran si fuentePago es EFECTIVO_CAJA (ese dinero siempre es efectivo
   * físico de caja) o si el costo total es 0.
   */
  montoEfectivoFondo?: number;
  montoTransferenciaFondo?: number;
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
