import { FuentePago, MetodoPago } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, ValidateIf } from 'class-validator';

export class CrearGastoDto {
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  monto: number;

  @IsString()
  @IsNotEmpty()
  categoria: string;

  @IsEnum(FuentePago)
  fuentePago: FuentePago;

  @ValidateIf((dto: CrearGastoDto) => dto.fuentePago === 'FONDO_GENERAL')
  @IsEnum(MetodoPago)
  moneda?: MetodoPago;
}
