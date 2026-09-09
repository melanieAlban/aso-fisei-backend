import { TemporizadorActivo } from '../domain/temporizador-activo.entity';
import { TemporizadorActivoRepository } from '../domain/temporizador-activo.repository';

export class ListarTemporizadoresUseCase {
  constructor(private readonly temporizadorRepository: TemporizadorActivoRepository) {}

  ejecutar(): Promise<TemporizadorActivo[]> {
    return this.temporizadorRepository.listarTodos();
  }
}
