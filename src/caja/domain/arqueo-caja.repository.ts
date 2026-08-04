import { ArqueoCaja, ClasificacionDiferencia } from './arqueo-caja.entity';

export interface ArqueoCajaRepository {
  buscarPorId(id: string): Promise<ArqueoCaja | null>;

  actualizarClasificacion(
    id: string,
    clasificacion: ClasificacionDiferencia,
  ): Promise<ArqueoCaja>;
}
