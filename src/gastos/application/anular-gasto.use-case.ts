import { AuditoriaContextService } from '../../shared/infraestructure/auditoria/auditoria-context.service';
import { Gasto } from '../domain/gasto.entity';
import { GastoRepository } from '../domain/gasto.repository';
import { AnularGastoDatos, GastoTransaccionPort } from './ports/gasto-transaccion.port';

export class AnularGastoUseCase {
  constructor(
    private readonly gastoTransaccion: GastoTransaccionPort,
    private readonly gastoRepository: GastoRepository,
    private readonly auditoriaContexto: AuditoriaContextService,
  ) {}

  async ejecutar(datos: AnularGastoDatos): Promise<Gasto> {
    const gastoActual = await this.gastoRepository.buscarPorId(datos.gastoId);
    if (gastoActual) {
      this.auditoriaContexto.setValorAnterior(gastoActual);
    }

    return this.gastoTransaccion.anularGasto(datos);
  }
}
