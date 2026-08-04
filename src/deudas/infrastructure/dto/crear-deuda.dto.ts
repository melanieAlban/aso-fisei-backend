import { TipoDeuda } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class CrearDeudaDto {
  @IsEnum(TipoDeuda)
  tipo: TipoDeuda;

  @IsString()
  @IsNotEmpty()
  contraparte: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  montoTotal: number;

  @IsOptional()
  @IsUUID()
  gastoId?: string;
}
