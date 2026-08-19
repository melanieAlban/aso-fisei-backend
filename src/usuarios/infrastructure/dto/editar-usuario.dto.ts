import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EditarUsuarioDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombre?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  usuario?: string;
}
