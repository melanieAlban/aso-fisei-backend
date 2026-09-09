import { TemporizadorActivo } from '../domain/temporizador-activo.entity';
import { TemporizadorActivoRepository } from '../domain/temporizador-activo.repository';

export class CrearTemporizadorUseCase {
  constructor(private readonly temporizadorRepository: TemporizadorActivoRepository) {}

  ejecutar(datos: {
    nombre: string;
    horaInicio: Date;
    horaFin: Date;
    usuarioId: string;
  }): Promise<TemporizadorActivo> {
    const temporizador = new TemporizadorActivo(
      crypto.randomUUID(),
      datos.nombre,
      datos.horaInicio,
      datos.horaFin,
      datos.usuarioId,
      new Date(),
    );

    return this.temporizadorRepository.crear(temporizador);
  }
}
