import { ConflictError, NotFoundError } from '../../shared/domain/errors';
import { EventoRepository } from '../domain/evento.repository';
import { GastoEventoRepository } from '../domain/gasto-evento.repository';

export class EliminarGastoEventoUseCase {
  constructor(
    private readonly gastoRepository: GastoEventoRepository,
    private readonly eventoRepository: EventoRepository,
  ) {}

  async ejecutar(id: string): Promise<void> {
    const gasto = await this.gastoRepository.buscarPorId(id);

    if (!gasto) {
      throw new NotFoundError('Gasto no encontrado');
    }

    const evento = await this.eventoRepository.buscarPorId(gasto.eventoId);

    if (!evento) {
      throw new NotFoundError('Evento no encontrado');
    }
    if (evento.estado !== 'ACTIVO') {
      throw new ConflictError('El evento no está activo');
    }

    await this.gastoRepository.eliminar(id);
  }
}
