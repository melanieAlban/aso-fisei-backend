import { GastoEvento } from '../domain/gasto-evento.entity';
import { GastoEventoRepository } from '../domain/gasto-evento.repository';

export class ListarGastosEventoUseCase {
  constructor(private readonly gastoRepository: GastoEventoRepository) {}

  ejecutar(eventoId: string): Promise<GastoEvento[]> {
    return this.gastoRepository.listarPorEvento(eventoId);
  }
}
