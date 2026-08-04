import { IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';

export class RegistrarPerdidaDto {
  @IsUUID()
  productoId: string;

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsString()
  @IsNotEmpty()
  motivo: string;
}
