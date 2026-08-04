import { IsNotEmpty, IsString } from 'class-validator';

export class AnularItemDto {
  @IsString()
  @IsNotEmpty()
  motivo: string;
}
