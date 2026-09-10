import { CompromisoPagoEvento } from './compromiso-pago-evento.entity';

export interface CompromisoPagoEventoRepository {
  crear(compromiso: CompromisoPagoEvento): Promise<CompromisoPagoEvento>;

  guardar(compromiso: CompromisoPagoEvento): Promise<CompromisoPagoEvento>;

  eliminar(id: string): Promise<void>;

  buscarPorId(id: string): Promise<CompromisoPagoEvento | null>;

  listarPorEvento(eventoId: string): Promise<CompromisoPagoEvento[]>;
}
