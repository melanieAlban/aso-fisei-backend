import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { DireccionAjuste } from '../../application/ports/inventario-transaccion.port';

export class RegistrarAjusteDto {
  @IsUUID()
  productoId: string;

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsIn(['INCREMENTO', 'DECREMENTO'])
  direccion: DireccionAjuste;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  motivo?: string;
}
