import { IsUUID } from 'class-validator';

export class AsignarRolDto {
  @IsUUID()
  rolId: string;
}
