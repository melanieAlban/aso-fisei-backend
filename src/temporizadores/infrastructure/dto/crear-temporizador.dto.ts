import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CrearTemporizadorDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsDateString()
  horaInicio: string;

  @IsDateString()
  horaFin: string;
}
