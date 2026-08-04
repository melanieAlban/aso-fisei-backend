import {
  InventarioTransaccionPort,
  RegistrarPerdidaDatos,
  ResultadoMovimiento,
} from './ports/inventario-transaccion.port';

export class RegistrarPerdidaUseCase {
  constructor(private readonly inventarioTransaccion: InventarioTransaccionPort) {}

  ejecutar(datos: RegistrarPerdidaDatos): Promise<ResultadoMovimiento> {
    return this.inventarioTransaccion.registrarPerdida(datos);
  }
}
