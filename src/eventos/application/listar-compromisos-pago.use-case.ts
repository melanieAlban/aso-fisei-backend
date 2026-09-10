import { CompromisoPagoEvento } from '../domain/compromiso-pago-evento.entity';
import { CompromisoPagoEventoRepository } from '../domain/compromiso-pago-evento.repository';

export class ListarCompromisosPagoUseCase {
  constructor(private readonly compromisoRepository: CompromisoPagoEventoRepository) {}

  ejecutar(eventoId: string): Promise<CompromisoPagoEvento[]> {
    return this.compromisoRepository.listarPorEvento(eventoId);
  }
}
