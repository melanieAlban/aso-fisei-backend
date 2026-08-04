import { EstadoDeuda, TipoDeuda } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export class ListarDeudasQueryDto {
  @IsOptional()
  @IsEnum(TipoDeuda)
  type?: TipoDeuda;

  @IsOptional()
  @IsEnum(EstadoDeuda)
  status?: EstadoDeuda;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
