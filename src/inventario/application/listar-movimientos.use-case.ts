import { MovimientoInventario } from '../domain/movimiento-inventario.entity';
import {
  FiltrosMovimientos,
  MovimientoInventarioRepository,
} from '../domain/movimiento-inventario.repository';

export class ListarMovimientosUseCase {
  constructor(private readonly movimientoInventarioRepository: MovimientoInventarioRepository) {}

  ejecutar(filtros: FiltrosMovimientos): Promise<MovimientoInventario[]> {
    return this.movimientoInventarioRepository.listarTodos(filtros);
  }
}
