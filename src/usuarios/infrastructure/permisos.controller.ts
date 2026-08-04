import { Controller, Get, UseGuards } from '@nestjs/common';
import { ListarPermisosUseCase } from '../application/listar-permisos.use-case';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller('permissions')
@UseGuards(JwtAuthGuard)
export class PermisosController {
  constructor(private readonly listarPermisosUseCase: ListarPermisosUseCase) {}

  @Get()
  listar() {
    return this.listarPermisosUseCase.ejecutar();
  }
}
