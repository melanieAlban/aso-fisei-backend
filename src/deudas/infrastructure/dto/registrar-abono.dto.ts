import { MetodoPago } from '@prisma/client';
import { IsEnum, IsNumber, IsPositive } from 'class-validator';

export class RegistrarAbonoDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  monto: number;

  @IsEnum(MetodoPago)
  metodoPago: MetodoPago;
}
