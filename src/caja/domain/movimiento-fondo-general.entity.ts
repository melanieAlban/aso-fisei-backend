import { MetodoPago } from './venta.entity';

export type TipoMovimientoFondo = 'RETIRO_CAJA' | 'GASTO' | 'AJUSTE_INICIAL' | 'UTILIDAD_EVENTO';

export class MovimientoFondoGeneral {
  constructor(
    public readonly id: string,
    public readonly usuarioId: string,
    public readonly tipo: TipoMovimientoFondo,
    public readonly monto: number,
    public readonly metodoPago: MetodoPago,
    public readonly saldoResultanteEfectivo: number,
    public readonly saldoResultanteTransferencia: number,
    public readonly referenciaId: string | null,
    public readonly descripcion: string | null,
    public readonly fecha: Date,
  ) {}
}
