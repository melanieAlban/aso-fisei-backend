import { AbonoDeuda } from './abono-deuda.entity';
import { Deuda, EstadoDeuda, TipoDeuda } from './deuda.entity';

export interface FiltrosDeudas {
  tipo?: TipoDeuda;
  estado?: EstadoDeuda;
}

export interface DeudaConAbonos {
  deuda: Deuda;
  abonos: AbonoDeuda[];
}

export interface DeudaRepository {
  crear(deuda: Deuda): Promise<Deuda>;

  buscarPorId(id: string): Promise<DeudaConAbonos | null>;

  listarTodos(
    filtros: FiltrosDeudas,
    page: number,
    limit: number,
  ): Promise<{ deudas: DeudaConAbonos[]; total: number }>;
}
