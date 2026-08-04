import { FuentePagoValor, Gasto, MonedaFondo } from '../../domain/gasto.entity';

export interface RegistrarGastoDatos {
  usuarioId: string;
  descripcion: string;
  monto: number;
  categoria: string;
  fuentePago: FuentePagoValor;
  moneda?: MonedaFondo;
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
