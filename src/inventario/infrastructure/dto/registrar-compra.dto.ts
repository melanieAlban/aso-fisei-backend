import { FuentePago } from '@prisma/client';
import { IsEnum, IsInt, IsNumber, IsPositive, IsUUID, Min } from 'class-validator';

export class RegistrarCompraDto {
  @IsUUID()
  productoId: string;

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  costoUnitario: number;

  @IsEnum(FuentePago)
  fuentePago: FuentePago;
}
