import { ArqueoCaja } from '../../domain/arqueo-caja.entity';
import { Caja } from '../../domain/caja.entity';
import { DetalleVenta, EstadoAlquiler } from '../../domain/detalle-venta.entity';
import { MovimientoFondoGeneral } from '../../domain/movimiento-fondo-general.entity';
import { MetodoPago } from '../../domain/venta.entity';
import { VentaConDetalle } from '../../domain/venta.repository';

export interface AbrirCajaDatos {
  usuarioId: string;
  fondoInicialEfectivo: number;
}

export interface LineaVentaDatos {
  productoId: string;
  cantidad: number;
  esAlquiler?: boolean;
  estadoAlquiler?: EstadoAlquiler;
  duracionMinutos?: number;
}

export interface RegistrarVentaDatos {
  usuarioId: string;
  metodoPago: MetodoPago;
  lineas: LineaVentaDatos[];
}

export interface AnularItemVentaDatos {
  ventaId: string;
  itemId: string;
  motivo: string;
  usuarioId: string;
}

export interface RealizarArqueoDatos {
  cajaId: string;
  usuarioId: string;
  efectivoContado: number;
  transferenciaContado: number;
  montoRetiradoEfectivo: number;
  montoRetiradoTransferencia: number;
  montoDejadoFondoCambio: number;
}

export interface AjustarSaldoInicialDatos {
  usuarioId: string;
  montoEfectivo: number;
  montoTransferencia: number;
  justificacion: string;
}

export interface AjusteFondoResultado {
  movimientos: MovimientoFondoGeneral[];
  saldoEfectivo: number;
  saldoTransferencia: number;
}

export interface CajaTransaccionPort {
  abrirCaja(datos: AbrirCajaDatos): Promise<Caja>;

  registrarVenta(datos: RegistrarVentaDatos): Promise<VentaConDetalle>;

  anularItemVenta(datos: AnularItemVentaDatos): Promise<DetalleVenta>;

  realizarArqueo(datos: RealizarArqueoDatos): Promise<ArqueoCaja>;

  ajustarSaldoInicialFondo(datos: AjustarSaldoInicialDatos): Promise<AjusteFondoResultado>;
}
