import { Rol } from './rol.entity';

export interface RolRepository {
  listarTodos(): Promise<Rol[]>;

  buscarPorId(id: string): Promise<Rol | null>;
}
