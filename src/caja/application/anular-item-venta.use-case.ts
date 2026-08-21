import { AuditoriaContextService } from '../../shared/infraestructure/auditoria/auditoria-context.service';
import { DetalleVenta } from '../domain/detalle-venta.entity';
import { VentaRepository } from '../domain/venta.repository';
import { AnularItemVentaDatos, CajaTransaccionPort } from './ports/caja-transaccion.port';

export class AnularItemVentaUseCase {
  constructor(
    private readonly cajaTransaccion: CajaTransaccionPort,
    private readonly ventaRepository: VentaRepository,
    private readonly auditoriaContexto: AuditoriaContextService,
  ) {}

  async ejecutar(datos: AnularItemVentaDatos): Promise<DetalleVenta> {
    const detalleActual = await this.ventaRepository.buscarDetallePorId(datos.itemId);
    if (detalleActual) {
      this.auditoriaContexto.setValorAnterior(detalleActual);
    }

    return this.cajaTransaccion.anularItemVenta(datos);
  }
}
