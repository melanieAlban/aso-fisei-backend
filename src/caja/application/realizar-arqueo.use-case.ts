import { AuditoriaContextService } from '../../shared/infraestructure/auditoria/auditoria-context.service';
import { ArqueoCaja } from '../domain/arqueo-caja.entity';
import { CajaRepository } from '../domain/caja.repository';
import { CajaTransaccionPort, RealizarArqueoDatos } from './ports/caja-transaccion.port';

export class RealizarArqueoUseCase {
  constructor(
    private readonly cajaTransaccion: CajaTransaccionPort,
    private readonly cajaRepository: CajaRepository,
    private readonly auditoriaContexto: AuditoriaContextService,
  ) {}

  async ejecutar(datos: RealizarArqueoDatos): Promise<ArqueoCaja> {
    const cajaActual = await this.cajaRepository.buscarPorId(datos.cajaId);
    if (cajaActual) {
      this.auditoriaContexto.setValorAnterior(cajaActual);
    }

    return this.cajaTransaccion.realizarArqueo(datos);
  }
}
