import {
  CerrarEventoDatos,
  EventoTransaccionPort,
  ResultadoCierreEvento,
} from './ports/evento-transaccion.port';

export class CerrarEventoUseCase {
  constructor(private readonly eventoTransaccion: EventoTransaccionPort) {}

  ejecutar(datos: CerrarEventoDatos): Promise<ResultadoCierreEvento> {
    return this.eventoTransaccion.cerrarEvento(datos);
  }
}
