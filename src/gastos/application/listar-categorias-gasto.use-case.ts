import { GastoRepository } from '../domain/gasto.repository';

export class ListarCategoriasGastoUseCase {
  constructor(private readonly gastoRepository: GastoRepository) {}

  ejecutar(): Promise<string[]> {
    return this.gastoRepository.listarCategorias();
  }
}
