import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class ActualizarAsignacionEntradasDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombreReferencia?: string;

  @IsOptional()
  @IsString()
  telefono?: string | null;

  @IsOptional()
  @IsString()
  semestre?: string | null;

  @IsOptional()
  @IsString()
  carrera?: string | null;

  @IsOptional()
  @IsInt()
  @IsPositive()
  cantidadAsignada?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  cantidadVendida?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  cantidadVendidaCombo?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  cantidadDevuelta?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  dineroRecibido?: number;

  // Cuánto de lo recibido fue en cada moneda — uno puede ser 0 (pago único) o
  // ambos > 0 (pago mixto). Su suma debe ser igual a dineroRecibido.
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  montoEfectivo?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  montoTransferencia?: number;
}
