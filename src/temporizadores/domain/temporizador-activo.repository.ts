import { TemporizadorActivo } from './temporizador-activo.entity';

export interface TemporizadorActivoRepository {
  crear(temporizador: TemporizadorActivo): Promise<TemporizadorActivo>;

  eliminar(id: string): Promise<void>;

  listarTodos(): Promise<TemporizadorActivo[]>;
}
