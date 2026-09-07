import { GastoEvento } from './gasto-evento.entity';

export interface GastoEventoRepository {
  crear(gasto: GastoEvento): Promise<GastoEvento>;

  guardar(gasto: GastoEvento): Promise<GastoEvento>;

  eliminar(id: string): Promise<void>;

  buscarPorId(id: string): Promise<GastoEvento | null>;

  listarPorEvento(eventoId: string): Promise<GastoEvento[]>;
}
