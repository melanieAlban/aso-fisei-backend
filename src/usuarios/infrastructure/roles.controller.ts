import { Controller, Get, UseGuards } from '@nestjs/common';
import { ListarRolesUseCase } from '../application/listar-roles.use-case';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private readonly listarRolesUseCase: ListarRolesUseCase) {}

  @Get()
  listar() {
    return this.listarRolesUseCase.ejecutar();
  }
}
