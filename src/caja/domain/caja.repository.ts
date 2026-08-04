import { Caja } from './caja.entity';

export interface CajaRepository {
  buscarAbierta(): Promise<Caja | null>;

  buscarPorId(id: string): Promise<Caja | null>;
}
