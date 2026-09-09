import { TemporizadorActivoRepository } from '../domain/temporizador-activo.repository';

export class EliminarTemporizadorUseCase {
  constructor(private readonly temporizadorRepository: TemporizadorActivoRepository) {}

  ejecutar(id: string): Promise<void> {
    return this.temporizadorRepository.eliminar(id);
  }
}
