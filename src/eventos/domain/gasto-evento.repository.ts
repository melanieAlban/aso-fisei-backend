import { GastoEvento } from './gasto-evento.entity';

export interface GastoEventoRepository {
  crear(gasto: GastoEvento): Promise<GastoEvento>;

  listarPorEvento(eventoId: string): Promise<GastoEvento[]>;
}
