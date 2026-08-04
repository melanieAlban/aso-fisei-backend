import { ConfiguracionSistemaRepository } from '../domain/configuracion-sistema.repository';

export class ObtenerConfiguracionUseCase {
  constructor(private readonly configuracionRepository: ConfiguracionSistemaRepository) {}

  ejecutar(clave: string): Promise<string | null> {
    return this.configuracionRepository.obtener(clave);
  }
}
