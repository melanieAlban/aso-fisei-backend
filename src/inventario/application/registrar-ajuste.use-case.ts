import {
  InventarioTransaccionPort,
  RegistrarAjusteDatos,
  ResultadoMovimiento,
} from './ports/inventario-transaccion.port';

export class RegistrarAjusteUseCase {
  constructor(private readonly inventarioTransaccion: InventarioTransaccionPort) {}

  ejecutar(datos: RegistrarAjusteDatos): Promise<ResultadoMovimiento> {
    return this.inventarioTransaccion.registrarAjuste(datos);
  }
}
