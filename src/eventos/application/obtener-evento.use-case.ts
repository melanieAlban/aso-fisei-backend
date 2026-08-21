import { NotFoundError } from '../../shared/domain/errors';
import { Evento } from '../domain/evento.entity';
import { EventoRepository } from '../domain/evento.repository';

export class ObtenerEventoUseCase {
  constructor(private readonly eventoRepository: EventoRepository) {}

  async ejecutar(id: string): Promise<Evento> {
    const evento = await this.eventoRepository.buscarPorId(id);

    if (!evento) {
      throw new NotFoundError('Evento no encontrado');
    }

    return evento;
  }
}
