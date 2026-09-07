import { ConflictError, NotFoundError } from '../../shared/domain/errors';
import { EventoRepository } from '../domain/evento.repository';
import { IngresoEventoRepository } from '../domain/ingreso-evento.repository';

export class EliminarIngresoEventoUseCase {
  constructor(
    private readonly ingresoRepository: IngresoEventoRepository,
    private readonly eventoRepository: EventoRepository,
  ) {}

  async ejecutar(id: string): Promise<void> {
    const ingreso = await this.ingresoRepository.buscarPorId(id);

    if (!ingreso) {
      throw new NotFoundError('Ingreso no encontrado');
    }

    const evento = await this.eventoRepository.buscarPorId(ingreso.eventoId);

    if (!evento) {
      throw new NotFoundError('Evento no encontrado');
    }
    if (evento.estado !== 'ACTIVO') {
      throw new ConflictError('El evento no está activo');
    }

    await this.ingresoRepository.eliminar(id);
  }
}
