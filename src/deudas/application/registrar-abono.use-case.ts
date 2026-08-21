import { AuditoriaContextService } from '../../shared/infraestructure/auditoria/auditoria-context.service';
import { DeudaRepository } from '../domain/deuda.repository';
import { DeudaTransaccionPort, RegistrarAbonoDatos, ResultadoAbono } from './ports/deuda-transaccion.port';

export class RegistrarAbonoUseCase {
  constructor(
    private readonly deudaTransaccion: DeudaTransaccionPort,
    private readonly deudaRepository: DeudaRepository,
    private readonly auditoriaContexto: AuditoriaContextService,
  ) {}

  async ejecutar(datos: RegistrarAbonoDatos): Promise<ResultadoAbono> {
    const actual = await this.deudaRepository.buscarPorId(datos.deudaId);
    if (actual) {
      this.auditoriaContexto.setValorAnterior(actual.deuda);
    }

    return this.deudaTransaccion.registrarAbono(datos);
  }
}
