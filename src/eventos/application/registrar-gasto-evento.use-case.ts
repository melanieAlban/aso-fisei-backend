import { ConflictError, NotFoundError } from '../../shared/domain/errors';
import { EventoRepository } from '../domain/evento.repository';
import { GastoEvento } from '../domain/gasto-evento.entity';
import { GastoEventoRepository } from '../domain/gasto-evento.repository';
import { MetodoPagoEvento } from '../domain/ingreso-evento.entity';

export class RegistrarGastoEventoUseCase {
  constructor(
    private readonly gastoRepository: GastoEventoRepository,
    private readonly eventoRepository: EventoRepository,
  ) {}

  async ejecutar(datos: {
    eventoId: string;
    usuarioId: string;
    descripcion: string;
    monto: number;
    metodoPago: MetodoPagoEvento;
  }): Promise<GastoEvento> {
    const evento = await this.eventoRepository.buscarPorId(datos.eventoId);

    if (!evento) {
      throw new NotFoundError('Evento no encontrado');
    }
    if (evento.estado === 'CERRADO') {
      throw new ConflictError('El evento ya está cerrado');
    }

    const gasto = new GastoEvento(
      crypto.randomUUID(),
      datos.eventoId,
      datos.usuarioId,
      datos.descripcion,
      datos.monto,
      datos.metodoPago,
      new Date(),
    );

    return this.gastoRepository.crear(gasto);
  }
}
