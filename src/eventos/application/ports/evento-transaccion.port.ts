import { Evento } from '../../domain/evento.entity';

export interface CerrarEventoDatos {
  eventoId: string;
  usuarioId: string;
}

export interface ResumenCierreEvento {
  ingresosEfectivo: number;
  ingresosTransferencia: number;
  gastosEfectivo: number;
  gastosTransferencia: number;
  utilidadEfectivo: number;
  utilidadTransferencia: number;
  saldoResultanteEfectivo: number;
  saldoResultanteTransferencia: number;
}

export interface ResultadoCierreEvento {
  evento: Evento;
  resumen: ResumenCierreEvento;
}

export interface EventoTransaccionPort {
  cerrarEvento(datos: CerrarEventoDatos): Promise<ResultadoCierreEvento>;
}
