import { ConflictError, NotFoundError } from '../../shared/domain/errors';
import { CompromisoPagoEventoRepository } from '../domain/compromiso-pago-evento.repository';
import { EventoRepository } from '../domain/evento.repository';

export class EliminarCompromisoPagoUseCase {
  constructor(
    private readonly compromisoRepository: CompromisoPagoEventoRepository,
    private readonly eventoRepository: EventoRepository,
  ) {}

  async ejecutar(id: string): Promise<void> {
    const compromiso = await this.compromisoRepository.buscarPorId(id);

    if (!compromiso) {
      throw new NotFoundError('Compromiso de pago no encontrado');
    }

    const evento = await this.eventoRepository.buscarPorId(compromiso.eventoId);

    if (!evento) {
      throw new NotFoundError('Evento no encontrado');
    }
    if (evento.estado !== 'ACTIVO') {
      throw new ConflictError('El evento no está activo');
    }

    await this.compromisoRepository.eliminar(id);
  }
}
