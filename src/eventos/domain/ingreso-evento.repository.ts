import { IngresoEvento } from './ingreso-evento.entity';

export interface IngresoEventoRepository {
  crear(ingreso: IngresoEvento): Promise<IngresoEvento>;

  listarPorEvento(eventoId: string): Promise<IngresoEvento[]>;
}
