import { MetodoPago } from '@prisma/client';
import { IsBoolean, IsEnum, IsInt, IsPositive } from 'class-validator';

export class RegistrarVentaEntradaDto {
  @IsInt()
  @IsPositive()
  cantidad: number;

  @IsBoolean()
  esCombo: boolean;

  @IsEnum(MetodoPago)
  metodoPago: MetodoPago;
}
