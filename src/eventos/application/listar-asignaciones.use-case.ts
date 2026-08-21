import { AsignacionEntradas } from '../domain/asignacion-entradas.entity';
import { AsignacionEntradasRepository } from '../domain/asignacion-entradas.repository';

export class ListarAsignacionesUseCase {
  constructor(private readonly asignacionRepository: AsignacionEntradasRepository) {}

  ejecutar(eventoId: string): Promise<AsignacionEntradas[]> {
    return this.asignacionRepository.listarPorEvento(eventoId);
  }
}
