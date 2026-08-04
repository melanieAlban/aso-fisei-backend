import { VentaConDetalle } from '../domain/venta.repository';
import { CajaTransaccionPort, RegistrarVentaDatos } from './ports/caja-transaccion.port';

export class RegistrarVentaUseCase {
  constructor(private readonly cajaTransaccion: CajaTransaccionPort) {}

  ejecutar(datos: RegistrarVentaDatos): Promise<VentaConDetalle> {
    return this.cajaTransaccion.registrarVenta(datos);
  }
}
