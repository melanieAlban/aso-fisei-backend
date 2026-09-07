import { AuditoriaContextService } from '../../shared/infraestructure/auditoria/auditoria-context.service';
import { ConflictError, NotFoundError } from '../../shared/domain/errors';
import { Evento } from '../domain/evento.entity';
import { EventoRepository } from '../domain/evento.repository';

export class EditarEventoUseCase {
  constructor(
    private readonly eventoRepository: EventoRepository,
    private readonly auditoriaContexto: AuditoriaContextService,
  ) {}

  async ejecutar(datos: {
    eventoId: string;
    nombre?: string;
    presupuesto?: number | null;
    fechaInicio?: Date;
    fechaFin?: Date | null;
  }): Promise<Evento> {
    const evento = await this.eventoRepository.buscarPorId(datos.eventoId);

    if (!evento) {
      throw new NotFoundError('Evento no encontrado');
    }
    if (evento.estado !== 'ACTIVO') {
      throw new ConflictError('Solo se puede editar un evento activo');
    }

    this.auditoriaContexto.setValorAnterior(evento);

    const eventoActualizado = new Evento(
      evento.id,
      datos.nombre ?? evento.nombre,
      datos.presupuesto !== undefined ? datos.presupuesto : evento.presupuesto,
      evento.estado,
      datos.fechaInicio ?? evento.fechaInicio,
      datos.fechaFin !== undefined ? datos.fechaFin : evento.fechaFin,
      evento.fechaCierre,
      evento.motivoAnulacion,
      evento.usuarioAnulacionId,
    );

    return this.eventoRepository.guardar(eventoActualizado);
  }
}
