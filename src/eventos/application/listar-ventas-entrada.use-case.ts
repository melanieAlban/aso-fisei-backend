import { VentaEntrada } from '../domain/venta-entrada.entity';
import { VentaEntradaRepository } from '../domain/venta-entrada.repository';

export class ListarVentasEntradaUseCase {
  constructor(private readonly ventaRepository: VentaEntradaRepository) {}

  ejecutar(eventoId: string): Promise<VentaEntrada[]> {
    return this.ventaRepository.listarPorEvento(eventoId);
  }
}
