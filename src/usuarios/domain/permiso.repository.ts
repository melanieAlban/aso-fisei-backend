import { Permiso } from './permiso.entity';

export interface PermisoRepository {
  listarTodos(): Promise<Permiso[]>;

  buscarPorId(id: string): Promise<Permiso | null>;
}
