import { Rol } from '../domain/rol.entity';
import { RolRepository } from '../domain/rol.repository';

export class ListarRolesUseCase {
  constructor(private readonly rolRepository: RolRepository) {}

  ejecutar(): Promise<Rol[]> {
    return this.rolRepository.listarTodos();
  }
}
