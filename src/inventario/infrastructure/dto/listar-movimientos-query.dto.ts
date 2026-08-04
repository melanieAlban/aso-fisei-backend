import { TipoMovimientoInventario } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';

export class ListarMovimientosQueryDto {
  @IsOptional()
  @IsEnum(TipoMovimientoInventario)
  tipo?: TipoMovimientoInventario;

  @IsOptional()
  @IsDateString()
  desde?: string;

  @IsOptional()
  @IsDateString()
  hasta?: string;
}
