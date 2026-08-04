import { SetMetadata } from '@nestjs/common';

export const REQUIERE_PERMISO_KEY = 'requierePermiso';

export const RequierePermiso = (codigoPermiso: string) =>
  SetMetadata(REQUIERE_PERMISO_KEY, codigoPermiso);
