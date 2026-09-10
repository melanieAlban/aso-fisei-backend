import { ConflictError, NotFoundError } from '../../shared/domain/errors';
import { CompromisoPagoEvento } from '../domain/compromiso-pago-evento.entity';
import { CompromisoPagoEventoRepository } from '../domain/compromiso-pago-evento.repository';
import { EventoRepository } from '../domain/evento.repository';

export class CrearCompromisoPagoUseCase {
  constructor(
    private readonly compromisoRepository: CompromisoPagoEventoRepository,
    private readonly eventoRepository: EventoRepository,
  ) {}

  async ejecutar(datos: {
    eventoId: string;
    descripcion: string;
    montoTotal: number;
    montoPagadoInicial?: number;
  }): Promise<CompromisoPagoEvento> {
    const evento = await this.eventoRepository.buscarPorId(datos.eventoId);

    if (!evento) {
      throw new NotFoundError('Evento no encontrado');
    }
    if (evento.estado !== 'ACTIVO') {
      throw new ConflictError('El evento no está activo');
    }

    const compromiso = new CompromisoPagoEvento(
      crypto.randomUUID(),
      datos.eventoId,
      datos.descripcion,
      datos.montoTotal,
      datos.montoPagadoInicial ?? 0,
      new Date(),
    );

    return this.compromisoRepository.crear(compromiso);
  }
}
