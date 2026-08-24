import { FuentePago } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min, ValidateIf } from 'class-validator';

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

  // Solo aplican cuando fuentePago es FONDO_GENERAL. Permiten dividir el gasto
  // entre las dos monedas del fondo (ej. parte efectivo, parte transferencia);
  // su suma debe ser igual a "monto" — el backend lo valida.
  @ValidateIf((dto: CrearGastoDto) => dto.fuentePago === 'FONDO_GENERAL')
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  montoEfectivoFondo?: number;

  @ValidateIf((dto: CrearGastoDto) => dto.fuentePago === 'FONDO_GENERAL')
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  montoTransferenciaFondo?: number;
}
