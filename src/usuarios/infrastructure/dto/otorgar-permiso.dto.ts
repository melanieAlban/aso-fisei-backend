import { IsUUID } from 'class-validator';

export class OtorgarPermisoDto {
  @IsUUID()
  permisoId: string;
}
