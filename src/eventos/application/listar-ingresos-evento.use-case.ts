import { IngresoEvento } from '../domain/ingreso-evento.entity';
import { IngresoEventoRepository } from '../domain/ingreso-evento.repository';

export class ListarIngresosEventoUseCase {
  constructor(private readonly ingresoRepository: IngresoEventoRepository) {}

  ejecutar(eventoId: string): Promise<IngresoEvento[]> {
    return this.ingresoRepository.listarPorEvento(eventoId);
  }
}
