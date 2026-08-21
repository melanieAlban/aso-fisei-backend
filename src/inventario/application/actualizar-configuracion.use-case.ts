import { AuditoriaContextService } from '../../shared/infraestructure/auditoria/auditoria-context.service';
import { ConfiguracionSistemaRepository } from '../domain/configuracion-sistema.repository';

export class ActualizarConfiguracionUseCase {
  constructor(
    private readonly configuracionRepository: ConfiguracionSistemaRepository,
    private readonly auditoriaContexto: AuditoriaContextService,
  ) {}

  async ejecutar(datos: { clave: string; valor: string }): Promise<void> {
    const valorAnterior = await this.configuracionRepository.obtener(datos.clave);
    this.auditoriaContexto.setValorAnterior({ clave: datos.clave, valor: valorAnterior });

    await this.configuracionRepository.actualizar(datos.clave, datos.valor);
  }
}
