import { AsignacionEntradas } from './asignacion-entradas.entity';

export interface AsignacionEntradasRepository {
  crear(asignacion: AsignacionEntradas): Promise<AsignacionEntradas>;

  actualizar(asignacion: AsignacionEntradas): Promise<AsignacionEntradas>;

  buscarPorId(id: string): Promise<AsignacionEntradas | null>;

  listarPorEvento(eventoId: string): Promise<AsignacionEntradas[]>;
}
