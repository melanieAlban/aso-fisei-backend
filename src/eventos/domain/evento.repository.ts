import { Evento } from './evento.entity';

export interface EventoRepository {
  crear(evento: Evento): Promise<Evento>;

  guardar(evento: Evento): Promise<Evento>;

  buscarPorId(id: string): Promise<Evento | null>;

  listarTodos(page: number, limit: number): Promise<{ eventos: Evento[]; total: number }>;
}
