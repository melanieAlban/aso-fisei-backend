import { ConflictError, NotFoundError } from '../../shared/domain/errors';
import { AsignacionEntradasRepository } from '../domain/asignacion-entradas.repository';
import { EventoRepository } from '../domain/evento.repository';
import { TipoEntradaRepository } from '../domain/tipo-entrada.repository';

export class EliminarAsignacionEntradasUseCase {
  constructor(
    private readonly asignacionRepository: AsignacionEntradasRepository,
    private readonly tipoEntradaRepository: TipoEntradaRepository,
    private readonly eventoRepository: EventoRepository,
  ) {}

  async ejecutar(id: string): Promise<void> {
    const asignacion = await this.asignacionRepository.buscarPorId(id);

    if (!asignacion) {
      throw new NotFoundError('Asignación no encontrada');
    }

    const tipoEntrada = await this.tipoEntradaRepository.buscarPorId(asignacion.tipoEntradaId);

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

    await this.asignacionRepository.eliminar(id);
  }
}
