import { MovimientoInventario, TipoMovimiento } from './movimiento-inventario.entity';

export interface FiltrosMovimientos {
  tipo?: TipoMovimiento;
  desde?: Date;
  hasta?: Date;
}

export interface MovimientoInventarioRepository {
  crear(movimiento: MovimientoInventario): Promise<MovimientoInventario>;

  listarPorProducto(
    productoId: string,
    filtros?: FiltrosMovimientos,
  ): Promise<MovimientoInventario[]>;

  listarTodos(filtros?: FiltrosMovimientos): Promise<MovimientoInventario[]>;
}
