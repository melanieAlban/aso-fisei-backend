import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../usuarios/infrastructure/auth/jwt-auth.guard';
import { UsuarioAutenticado } from '../../usuarios/infrastructure/auth/jwt-payload.interface';
import { PermisosGuard } from '../../usuarios/infrastructure/auth/permisos.guard';
import { RequierePermiso } from '../../usuarios/infrastructure/auth/requiere-permiso.decorator';
import { AnularGastoUseCase } from '../application/anular-gasto.use-case';
import { ListarGastosUseCase } from '../application/listar-gastos.use-case';
import { RegistrarGastoUseCase } from '../application/registrar-gasto.use-case';
import { AnularGastoDto } from './dto/anular-gasto.dto';
import { CrearGastoDto } from './dto/crear-gasto.dto';
import { ListarGastosQueryDto } from './dto/listar-gastos-query.dto';

interface RequestConUsuario extends Request {
  user: UsuarioAutenticado;
}

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(
    private readonly registrarGastoUseCase: RegistrarGastoUseCase,
    private readonly anularGastoUseCase: AnularGastoUseCase,
    private readonly listarGastosUseCase: ListarGastosUseCase,
  ) {}

  @Get()
  @UseGuards(PermisosGuard)
  @RequierePermiso('gastos.listar')
  listar(@Query() query: ListarGastosQueryDto) {
    return this.listarGastosUseCase.ejecutar({
      categoria: query.category,
      desde: query.from ? new Date(query.from) : undefined,
      hasta: query.to ? new Date(query.to) : undefined,
      page: query.page,
      limit: query.limit,
    });
  }

  @Post()
  @UseGuards(PermisosGuard)
  @RequierePermiso('gastos.crear')
  crear(@Body() dto: CrearGastoDto, @Req() req: RequestConUsuario) {
    return this.registrarGastoUseCase.ejecutar({
      usuarioId: req.user.sub,
      descripcion: dto.descripcion,
      monto: dto.monto,
      categoria: dto.categoria,
      fuentePago: dto.fuentePago,
      moneda: dto.moneda,
    });
  }

  @Patch(':id/void')
  @UseGuards(PermisosGuard)
  @RequierePermiso('gastos.anular')
  anular(@Param('id') id: string, @Body() dto: AnularGastoDto, @Req() req: RequestConUsuario) {
    return this.anularGastoUseCase.ejecutar({
      gastoId: id,
      usuarioId: req.user.sub,
      motivo: dto.motivo,
    });
  }
}
