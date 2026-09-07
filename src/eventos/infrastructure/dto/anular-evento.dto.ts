import { IsNotEmpty, IsString } from 'class-validator';

export class AnularEventoDto {
  @IsString()
  @IsNotEmpty()
  motivo: string;
}
