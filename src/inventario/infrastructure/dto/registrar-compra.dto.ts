import { FuentePago, MetodoPago } from '@prisma/client';
import { IsEnum, IsInt, IsNumber, IsPositive, IsUUID, Min, ValidateIf } from 'class-validator';

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

  @ValidateIf((dto: RegistrarCompraDto) => dto.fuentePago === 'FONDO_GENERAL')
  @IsEnum(MetodoPago)
  moneda?: MetodoPago;
}
