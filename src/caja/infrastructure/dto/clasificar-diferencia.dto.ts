import { ClasificacionDiferencia } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class ClasificarDiferenciaDto {
  @IsEnum(ClasificacionDiferencia)
  clasificacion: ClasificacionDiferencia;
}
