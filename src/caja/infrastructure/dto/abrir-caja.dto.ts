import { IsNumber, Min } from 'class-validator';

export class AbrirCajaDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  fondoInicialEfectivo: number;
}
