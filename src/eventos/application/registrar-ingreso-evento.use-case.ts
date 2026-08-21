import { ConflictError, NotFoundError } from '../../shared/domain/errors';
import { EventoRepository } from '../domain/evento.repository';
import { IngresoEvento, MetodoPagoEvento } from '../domain/ingreso-evento.entity';
import { IngresoEventoRepository } from '../domain/ingreso-evento.repository';

export class RegistrarIngresoEventoUseCase {
  constructor(
    private readonly ingresoRepository: IngresoEventoRepository,
    private readonly eventoRepository: EventoRepository,
  ) {}

  async ejecutar(datos: {
    eventoId: string;
    usuarioId: string;
    descripcion: string;
    monto: number;
    metodoPago: MetodoPagoEvento;
  }): Promise<IngresoEvento> {
    const evento = await this.eventoRepository.buscarPorId(datos.eventoId);

    if (!evento) {
      throw new NotFoundError('Evento no encontrado');
    }
    if (evento.estado === 'CERRADO') {
      throw new ConflictError('El evento ya está cerrado');
    }

    const ingreso = new IngresoEvento(
      crypto.randomUUID(),
      datos.eventoId,
      datos.usuarioId,
      datos.descripcion,
      datos.monto,
      datos.metodoPago,
      new Date(),
    );

    return this.ingresoRepository.crear(ingreso);
  }
}
