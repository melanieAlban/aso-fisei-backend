import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, ValidateIf } from 'class-validator';

export class CrearProductoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ValidateIf((dto: CrearProductoDto) => !dto.cobraPorTiempo)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  precioVenta?: number;

  @IsOptional()
  @IsBoolean()
  cobraPorTiempo?: boolean;

  @ValidateIf((dto: CrearProductoDto) => dto.cobraPorTiempo === true)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  tarifaPorHora?: number;
}
