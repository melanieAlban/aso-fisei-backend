import { IsInt, IsNotEmpty, IsPositive, IsString, IsUUID } from 'class-validator';

export class CrearAsignacionEntradasDto {
  @IsUUID()
  tipoEntradaId: string;

  @IsString()
  @IsNotEmpty()
  nombreReferencia: string;

  @IsInt()
  @IsPositive()
  cantidadAsignada: number;
}
