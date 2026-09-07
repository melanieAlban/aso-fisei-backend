import { MetodoPago } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

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

  @IsOptional()
  @IsEnum(MetodoPago)
  metodoPago?: MetodoPago;
}
