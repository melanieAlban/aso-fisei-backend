import { AuditoriaContextService } from '../../shared/infraestructure/auditoria/auditoria-context.service';
import { ConflictError, NotFoundError } from '../../shared/domain/errors';
import { Evento } from '../domain/evento.entity';
import { EventoRepository } from '../domain/evento.repository';

export class AnularEventoUseCase {
  constructor(
    private readonly eventoRepository: EventoRepository,
    private readonly auditoriaContexto: AuditoriaContextService,
  ) {}

  async ejecutar(datos: { eventoId: string; usuarioId: string; motivo: string }): Promise<Evento> {
    const evento = await this.eventoRepository.buscarPorId(datos.eventoId);

    if (!evento) {
      throw new NotFoundError('Evento no encontrado');
    }
    if (evento.estado !== 'ACTIVO') {
      throw new ConflictError('Solo se puede anular un evento activo');
    }

    this.auditoriaContexto.setValorAnterior(evento);

    const eventoAnulado = new Evento(
      evento.id,
      evento.nombre,
      evento.presupuesto,
      'ANULADO',
      evento.fechaInicio,
      evento.fechaFin,
      evento.fechaCierre,
      datos.motivo,
      datos.usuarioId,
    );

    return this.eventoRepository.guardar(eventoAnulado);
  }
}
