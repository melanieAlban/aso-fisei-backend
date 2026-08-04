import { IsNumber, Min } from 'class-validator';

export class RealizarArqueoDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  efectivoContado: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  transferenciaContado: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  montoRetiradoEfectivo: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  montoRetiradoTransferencia: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  montoDejadoFondoCambio: number;
}
