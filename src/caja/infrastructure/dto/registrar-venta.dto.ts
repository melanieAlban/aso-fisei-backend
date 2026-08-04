import { EstadoAlquiler, MetodoPago } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class LineaVentaDto {
  @IsUUID()
  productoId: string;

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsOptional()
  @IsBoolean()
  esAlquiler?: boolean;

  @IsOptional()
  @IsEnum(EstadoAlquiler)
  estadoAlquiler?: EstadoAlquiler;
}

export class RegistrarVentaDto {
  @IsEnum(MetodoPago)
  metodoPago: MetodoPago;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => LineaVentaDto)
  lineas: LineaVentaDto[];
}
