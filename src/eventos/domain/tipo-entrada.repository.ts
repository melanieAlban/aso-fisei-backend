import { TipoEntrada } from './tipo-entrada.entity';

export interface TipoEntradaRepository {
  crear(tipoEntrada: TipoEntrada): Promise<TipoEntrada>;

  guardar(tipoEntrada: TipoEntrada): Promise<TipoEntrada>;

  eliminar(id: string): Promise<void>;

  buscarPorId(id: string): Promise<TipoEntrada | null>;

  listarPorEvento(eventoId: string): Promise<TipoEntrada[]>;
}
