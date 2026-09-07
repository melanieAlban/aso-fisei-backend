import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class CrearAsignacionEntradasDto {
  @IsUUID()
  tipoEntradaId: string;

  @IsString()
  @IsNotEmpty()
  nombreReferencia: string;

  @IsInt()
  @IsPositive()
  cantidadAsignada: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  telefono?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  semestre?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  carrera?: string;
}
