import { MetodoPago } from '@prisma/client';
import { IsEnum, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class ActualizarAsignacionEntradasDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  cantidadVendida?: number;

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
