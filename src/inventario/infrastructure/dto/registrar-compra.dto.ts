import { FuentePago, MetodoPago } from '@prisma/client';
import { IsEnum, IsInt, IsNumber, IsOptional, IsUUID, Min, ValidateIf } from 'class-validator';

export class RegistrarCompraDto {
  @IsUUID()
  productoId: string;

  @IsInt()
  @Min(1)
  cantidad: number;

  // Opcional: productos como copias o servicios (billar) pueden no tener un
  // costo de adquisición real — se registra en 0 y solo se descuenta el gasto
  // si el usuario indica un monto mayor a 0.
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  costoUnitario?: number;

  @IsEnum(FuentePago)
  fuentePago: FuentePago;

  @ValidateIf((dto: RegistrarCompraDto) => dto.fuentePago === 'FONDO_GENERAL')
  @IsEnum(MetodoPago)
  moneda?: MetodoPago;
}
