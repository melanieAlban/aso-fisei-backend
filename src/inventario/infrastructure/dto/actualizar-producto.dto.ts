import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateIf } from 'class-validator';

export class ActualizarProductoDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombre?: string;

  @ValidateIf((dto: ActualizarProductoDto) => dto.cobraPorTiempo !== true)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  precioVenta?: number;

  @IsOptional()
  @IsBoolean()
  cobraPorTiempo?: boolean;

  @ValidateIf((dto: ActualizarProductoDto) => dto.cobraPorTiempo === true)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  tarifaPorHora?: number;
}
