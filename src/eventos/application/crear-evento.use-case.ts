import { Evento } from '../domain/evento.entity';
import { EventoRepository } from '../domain/evento.repository';

export class CrearEventoUseCase {
  constructor(private readonly eventoRepository: EventoRepository) {}

  ejecutar(datos: {
    nombre: string;
    presupuesto?: number;
    fechaInicio: Date;
    fechaFin?: Date;
  }): Promise<Evento> {
    const evento = new Evento(
      crypto.randomUUID(),
      datos.nombre,
      datos.presupuesto ?? null,
      'ACTIVO',
      datos.fechaInicio,
      datos.fechaFin ?? null,
      null,
    );

    return this.eventoRepository.crear(evento);
  }
}
