import { Gasto } from './gasto.entity';

export interface FiltrosGastos {
  categoria?: string;
  desde?: Date;
  hasta?: Date;
}

export interface GastoRepository {
  buscarPorId(id: string): Promise<Gasto | null>;

  listarTodos(
    filtros: FiltrosGastos,
    page: number,
    limit: number,
  ): Promise<{ gastos: Gasto[]; total: number }>;

  listarCategorias(): Promise<string[]>;
}
