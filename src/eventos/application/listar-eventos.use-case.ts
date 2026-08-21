import { Evento } from '../domain/evento.entity';
import { EventoRepository } from '../domain/evento.repository';

export class ListarEventosUseCase {
  constructor(private readonly eventoRepository: EventoRepository) {}

  async ejecutar(datos: {
    page?: number;
    limit?: number;
  }): Promise<{ eventos: Evento[]; total: number; page: number; limit: number }> {
    const page = datos.page && datos.page > 0 ? datos.page : 1;
    const limit = datos.limit && datos.limit > 0 ? datos.limit : 20;

    const { eventos, total } = await this.eventoRepository.listarTodos(page, limit);

    return { eventos, total, page, limit };
  }
}
