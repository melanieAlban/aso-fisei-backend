import { IngresoEvento } from './ingreso-evento.entity';

export interface IngresoEventoRepository {
  crear(ingreso: IngresoEvento): Promise<IngresoEvento>;

  guardar(ingreso: IngresoEvento): Promise<IngresoEvento>;

  eliminar(id: string): Promise<void>;

  buscarPorId(id: string): Promise<IngresoEvento | null>;

  listarPorEvento(eventoId: string): Promise<IngresoEvento[]>;
}
