export type ClasificacionDiferencia = 'GANANCIA' | 'PERDIDA' | 'PENDIENTE';

export class ArqueoCaja {
  constructor(
    public readonly id: string,
    public readonly cajaId: string,
    public readonly usuarioId: string,
    public readonly efectivoEsperado: number,
    public readonly efectivoContado: number,
    public readonly transferenciaEsperado: number,
    public readonly transferenciaContado: number,
    public readonly montoRetiradoEfectivo: number,
    public readonly montoRetiradoTransferencia: number,
    public readonly montoDejadoFondoCambio: number,
    public readonly clasificacionDiferencia: ClasificacionDiferencia | null,
    public readonly fecha: Date,
  ) {
    if (montoRetiradoEfectivo < 0 || montoRetiradoTransferencia < 0 || montoDejadoFondoCambio < 0) {
      throw new Error('Los montos del arqueo no pueden ser negativos');
    }
  }

  diferenciaEfectivo(): number {
    return this.efectivoEsperado - this.efectivoContado;
  }

  diferenciaTransferencia(): number {
    return this.transferenciaEsperado - this.transferenciaContado;
  }
}
