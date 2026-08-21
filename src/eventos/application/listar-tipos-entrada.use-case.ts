import { TipoEntrada } from '../domain/tipo-entrada.entity';
import { TipoEntradaRepository } from '../domain/tipo-entrada.repository';

export class ListarTiposEntradaUseCase {
  constructor(private readonly tipoEntradaRepository: TipoEntradaRepository) {}

  ejecutar(eventoId: string): Promise<TipoEntrada[]> {
    return this.tipoEntradaRepository.listarPorEvento(eventoId);
  }
}
