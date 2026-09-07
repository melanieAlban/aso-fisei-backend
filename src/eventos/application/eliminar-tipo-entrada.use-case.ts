import { ConflictError, NotFoundError } from '../../shared/domain/errors';
import { EventoRepository } from '../domain/evento.repository';
import { TipoEntradaRepository } from '../domain/tipo-entrada.repository';

export class EliminarTipoEntradaUseCase {
  constructor(
    private readonly tipoEntradaRepository: TipoEntradaRepository,
    private readonly eventoRepository: EventoRepository,
  ) {}

  async ejecutar(id: string): Promise<void> {
    const tipoEntrada = await this.tipoEntradaRepository.buscarPorId(id);

    if (!tipoEntrada) {
      throw new NotFoundError('Tipo de entrada no encontrado');
    }

    const evento = await this.eventoRepository.buscarPorId(tipoEntrada.eventoId);

    if (!evento) {
      throw new NotFoundError('Evento no encontrado');
    }
    if (evento.estado !== 'ACTIVO') {
      throw new ConflictError('El evento no está activo');
    }

    try {
      await this.tipoEntradaRepository.eliminar(id);
    } catch {
      throw new ConflictError(
        'No se puede borrar este tipo de entrada porque ya tiene asignaciones registradas',
      );
    }
  }
}
