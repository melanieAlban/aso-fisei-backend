import { DetalleVenta } from './detalle-venta.entity';
import { Venta } from './venta.entity';

export interface FiltrosVentas {
  desde?: Date;
  hasta?: Date;
}

export interface VentaConDetalle {
  venta: Venta;
  detalles: DetalleVenta[];
}

export interface ResumenDiario {
  fecha: string;
  totalEfectivo: number;
  totalTransferencia: number;
  cantidadVentas: number;
}

export interface VentaRepository {
  buscarPorId(id: string): Promise<VentaConDetalle | null>;

  listarTodos(
    filtros: FiltrosVentas,
    page: number,
    limit: number,
  ): Promise<{ ventas: VentaConDetalle[]; total: number }>;

  buscarDetallePorId(itemId: string): Promise<DetalleVenta | null>;

  marcarAlquilerDevuelto(itemId: string): Promise<DetalleVenta>;

  resumenDiarioPorCaja(cajaId: string): Promise<ResumenDiario[]>;
}
