import { Permiso } from '../domain/permiso.entity';
import { PermisoRepository } from '../domain/permiso.repository';

export class ListarPermisosUseCase {
  constructor(private readonly permisoRepository: PermisoRepository) {}

  ejecutar(): Promise<Permiso[]> {
    return this.permisoRepository.listarTodos();
  }
}
