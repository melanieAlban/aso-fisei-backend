import { ConfiguracionSistemaRepository } from '../domain/configuracion-sistema.repository';

export class ActualizarConfiguracionUseCase {
  constructor(private readonly configuracionRepository: ConfiguracionSistemaRepository) {}

  ejecutar(datos: { clave: string; valor: string }): Promise<void> {
    return this.configuracionRepository.actualizar(datos.clave, datos.valor);
  }
}
