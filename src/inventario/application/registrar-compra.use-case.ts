import {
  InventarioTransaccionPort,
  RegistrarCompraDatos,
  ResultadoMovimiento,
} from './ports/inventario-transaccion.port';

export class RegistrarCompraUseCase {
  constructor(private readonly inventarioTransaccion: InventarioTransaccionPort) {}

  ejecutar(datos: RegistrarCompraDatos): Promise<ResultadoMovimiento> {
    return this.inventarioTransaccion.registrarCompra(datos);
  }
}
