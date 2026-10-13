import { IsBoolean, IsInt, IsNumber, IsPositive, Min } from 'class-validator';

export class RegistrarVentaEntradaDto {
  @IsInt()
  @IsPositive()
  cantidad: number;

  @IsBoolean()
  esCombo: boolean;

  // Cuánto se pagó en cada moneda — uno puede ser 0 (pago único) o ambos > 0
  // (pago mixto). Su suma debe ser igual al monto calculado por el backend.
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  montoEfectivo: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  montoTransferencia: number;
}
