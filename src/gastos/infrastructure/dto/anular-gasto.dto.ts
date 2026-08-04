import { IsNotEmpty, IsString } from 'class-validator';

export class AnularGastoDto {
  @IsString()
  @IsNotEmpty()
  motivo: string;
}
