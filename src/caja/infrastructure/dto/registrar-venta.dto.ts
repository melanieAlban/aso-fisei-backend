import { EstadoAlquiler } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
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

  @IsOptional()
  @IsInt()
  @IsPositive()
  duracionMinutos?: number;
}

export class RegistrarVentaDto {
  // Cuánto se pagó en cada moneda — uno puede ser 0 (pago único) o ambos > 0
  // (pago mixto). Su suma debe ser igual al total calculado por el backend a
  // partir de las líneas.
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  montoEfectivo: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  montoTransferencia: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => LineaVentaDto)
  lineas: LineaVentaDto[];
}
