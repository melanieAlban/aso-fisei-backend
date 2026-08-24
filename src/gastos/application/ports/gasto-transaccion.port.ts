import { FuentePagoValor, Gasto } from '../../domain/gasto.entity';

export interface RegistrarGastoDatos {
  usuarioId: string;
  descripcion: string;
  monto: number;
  categoria: string;
  fuentePago: FuentePagoValor;
  /**
   * Solo aplican cuando fuentePago es FONDO_GENERAL: cómo se divide el monto
   * entre las dos monedas del fondo (pueden ser ambas > 0 para un pago mixto).
   * Su suma debe ser igual a "monto".
   */
  montoEfectivoFondo?: number;
  montoTransferenciaFondo?: number;
}

export interface AnularGastoDatos {
  gastoId: string;
  usuarioId: string;
  motivo: string;
}

export interface GastoTransaccionPort {
  registrarGasto(datos: RegistrarGastoDatos): Promise<Gasto>;

  anularGasto(datos: AnularGastoDatos): Promise<Gasto>;
}
