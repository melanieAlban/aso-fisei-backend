import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class CrearCompromisoPagoDto {
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  montoTotal: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  montoPagadoInicial?: number;
}
