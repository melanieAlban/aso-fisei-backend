import { ConflictError, NotFoundError } from '../../shared/domain/errors';
import { EventoRepository } from '../domain/evento.repository';
import { GastoEvento } from '../domain/gasto-evento.entity';
import { GastoEventoRepository } from '../domain/gasto-evento.repository';
import { MetodoPagoEvento } from '../domain/ingreso-evento.entity';

export class EditarGastoEventoUseCase {
  constructor(
    private readonly gastoRepository: GastoEventoRepository,
    private readonly eventoRepository: EventoRepository,
  ) {}

  async ejecutar(datos: {
    id: string;
    descripcion?: string;
    monto?: number;
    metodoPago?: MetodoPagoEvento;
  }): Promise<GastoEvento> {
    const actual = await this.gastoRepository.buscarPorId(datos.id);

    if (!actual) {
      throw new NotFoundError('Gasto no encontrado');
    }

    const evento = await this.eventoRepository.buscarPorId(actual.eventoId);

    if (!evento) {
      throw new NotFoundError('Evento no encontrado');
    }
    if (evento.estado !== 'ACTIVO') {
      throw new ConflictError('El evento no está activo');
    }

    const actualizado = new GastoEvento(
      actual.id,
      actual.eventoId,
      actual.usuarioId,
      datos.descripcion ?? actual.descripcion,
      datos.monto ?? actual.monto,
      datos.metodoPago ?? actual.metodoPago,
      actual.fecha,
    );

    return this.gastoRepository.guardar(actualizado);
  }
}
