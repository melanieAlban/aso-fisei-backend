import { MetodoPago } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class RegistrarIngresoEventoDto {
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  monto: number;

  @IsEnum(MetodoPago)
  metodoPago: MetodoPago;
}
