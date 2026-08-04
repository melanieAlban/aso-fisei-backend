import { DetalleVenta } from '../domain/detalle-venta.entity';
import { AnularItemVentaDatos, CajaTransaccionPort } from './ports/caja-transaccion.port';

export class AnularItemVentaUseCase {
  constructor(private readonly cajaTransaccion: CajaTransaccionPort) {}

  ejecutar(datos: AnularItemVentaDatos): Promise<DetalleVenta> {
    return this.cajaTransaccion.anularItemVenta(datos);
  }
}
