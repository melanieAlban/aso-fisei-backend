import { IsInt, Min } from 'class-validator';

export class ActualizarStockMinimoDto {
  @IsInt()
  @Min(0)
  valorMinimo: number;
}
