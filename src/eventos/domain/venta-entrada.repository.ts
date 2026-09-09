import { VentaEntrada } from './venta-entrada.entity';

export interface VentaEntradaRepository {
  crear(venta: VentaEntrada): Promise<VentaEntrada>;

  eliminar(id: string): Promise<void>;

  buscarPorId(id: string): Promise<VentaEntrada | null>;

  listarPorEvento(eventoId: string): Promise<VentaEntrada[]>;
}
