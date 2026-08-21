import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CrearTipoEntradaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  precio: number;

  @IsInt()
  @IsPositive()
  cantidadTotal: number;
}
