import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../usuarios/infrastructure/auth/jwt-auth.guard';
import { UsuarioAutenticado } from '../../usuarios/infrastructure/auth/jwt-payload.interface';
import { PermisosGuard } from '../../usuarios/infrastructure/auth/permisos.guard';
import { RequierePermiso } from '../../usuarios/infrastructure/auth/requiere-permiso.decorator';
import { CrearDeudaUseCase } from '../application/crear-deuda.use-case';
import { ListarDeudasUseCase } from '../application/listar-deudas.use-case';
import { ObtenerDeudaUseCase } from '../application/obtener-deuda.use-case';
import { RegistrarAbonoUseCase } from '../application/registrar-abono.use-case';
import { CrearDeudaDto } from './dto/crear-deuda.dto';
import { ListarDeudasQueryDto } from './dto/listar-deudas-query.dto';
import { RegistrarAbonoDto } from './dto/registrar-abono.dto';

interface RequestConUsuario extends Request {
  user: UsuarioAutenticado;
}

@Controller('debts')
@UseGuards(JwtAuthGuard)
export class DebtsController {
  constructor(
    private readonly crearDeudaUseCase: CrearDeudaUseCase,
    private readonly listarDeudasUseCase: ListarDeudasUseCase,
    private readonly obtenerDeudaUseCase: ObtenerDeudaUseCase,
    private readonly registrarAbonoUseCase: RegistrarAbonoUseCase,
  ) {}

  @Get()
  @UseGuards(PermisosGuard)
  @RequierePermiso('deudas.listar')
  listar(@Query() query: ListarDeudasQueryDto) {
    return this.listarDeudasUseCase.ejecutar({
      tipo: query.type,
      estado: query.status,
      page: query.page,
      limit: query.limit,
    });
  }

  @Post()
  @UseGuards(PermisosGuard)
  @RequierePermiso('deudas.crear')
  crear(@Body() dto: CrearDeudaDto, @Req() req: RequestConUsuario) {
    return this.crearDeudaUseCase.ejecutar({
      usuarioId: req.user.sub,
      gastoId: dto.gastoId,
      tipo: dto.tipo,
      contraparte: dto.contraparte,
      montoTotal: dto.montoTotal,
    });
  }

  @Get(':id')
  obtener(@Param('id') id: string) {
    return this.obtenerDeudaUseCase.ejecutar(id);
  }

  @Post(':id/payments')
  @UseGuards(PermisosGuard)
  @RequierePermiso('deudas.abonar')
  abonar(@Param('id') id: string, @Body() dto: RegistrarAbonoDto, @Req() req: RequestConUsuario) {
    return this.registrarAbonoUseCase.ejecutar({
      deudaId: id,
      usuarioId: req.user.sub,
      monto: dto.monto,
      metodoPago: dto.metodoPago,
    });
  }
}
