import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../usuarios/infrastructure/auth/jwt-auth.guard';
import { ListarCategoriasGastoUseCase } from '../application/listar-categorias-gasto.use-case';

@Controller('expense-categories')
@UseGuards(JwtAuthGuard)
export class ExpenseCategoriesController {
  constructor(private readonly listarCategoriasGastoUseCase: ListarCategoriasGastoUseCase) {}

  @Get()
  listar() {
    return this.listarCategoriasGastoUseCase.ejecutar();
  }
}
