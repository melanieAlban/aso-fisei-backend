import { AuditoriaContextService } from '../../shared/infraestructure/auditoria/auditoria-context.service';
import { NotFoundError } from '../../shared/domain/errors';
import { ArqueoCaja, ClasificacionDiferencia } from '../domain/arqueo-caja.entity';
import { ArqueoCajaRepository } from '../domain/arqueo-caja.repository';

export class ClasificarDiferenciaArqueoUseCase {
  constructor(
    private readonly arqueoCajaRepository: ArqueoCajaRepository,
    private readonly auditoriaContexto: AuditoriaContextService,
  ) {}

  async ejecutar(datos: {
    arqueoId: string;
    clasificacion: ClasificacionDiferencia;
  }): Promise<ArqueoCaja> {
    const arqueo = await this.arqueoCajaRepository.buscarPorId(datos.arqueoId);

    if (!arqueo) {
      throw new NotFoundError('Arqueo no encontrado');
    }

    this.auditoriaContexto.setValorAnterior(arqueo);

    return this.arqueoCajaRepository.actualizarClasificacion(datos.arqueoId, datos.clasificacion);
  }
}
