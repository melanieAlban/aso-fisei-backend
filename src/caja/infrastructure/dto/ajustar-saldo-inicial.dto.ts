import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AjustarSaldoInicialDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  montoEfectivo: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  montoTransferencia: number;

  @IsString()
  @IsNotEmpty()
  justificacion: string;
}
