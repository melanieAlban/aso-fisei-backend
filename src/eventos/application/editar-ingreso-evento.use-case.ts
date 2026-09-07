import { ConflictError, NotFoundError } from '../../shared/domain/errors';
import { EventoRepository } from '../domain/evento.repository';
import { IngresoEvento, MetodoPagoEvento } from '../domain/ingreso-evento.entity';
import { IngresoEventoRepository } from '../domain/ingreso-evento.repository';

export class EditarIngresoEventoUseCase {
  constructor(
    private readonly ingresoRepository: IngresoEventoRepository,
    private readonly eventoRepository: EventoRepository,
  ) {}

  async ejecutar(datos: {
    id: string;
    descripcion?: string;
    monto?: number;
    metodoPago?: MetodoPagoEvento;
  }): Promise<IngresoEvento> {
    const actual = await this.ingresoRepository.buscarPorId(datos.id);

    if (!actual) {
      throw new NotFoundError('Ingreso no encontrado');
    }

    const evento = await this.eventoRepository.buscarPorId(actual.eventoId);

    if (!evento) {
      throw new NotFoundError('Evento no encontrado');
    }
    if (evento.estado !== 'ACTIVO') {
      throw new ConflictError('El evento no está activo');
    }

    const actualizado = new IngresoEvento(
      actual.id,
      actual.eventoId,
      actual.usuarioId,
      datos.descripcion ?? actual.descripcion,
      datos.monto ?? actual.monto,
      datos.metodoPago ?? actual.metodoPago,
      actual.fecha,
    );

    return this.ingresoRepository.guardar(actualizado);
  }
}
