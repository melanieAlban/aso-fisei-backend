import { Body, Controller, Get, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../usuarios/infrastructure/auth/jwt-auth.guard';
import { UsuarioAutenticado } from '../../usuarios/infrastructure/auth/jwt-payload.interface';
import { PermisosGuard } from '../../usuarios/infrastructure/auth/permisos.guard';
import { RequierePermiso } from '../../usuarios/infrastructure/auth/requiere-permiso.decorator';
import { ActualizarConfiguracionUseCase } from '../application/actualizar-configuracion.use-case';
import { ListarMovimientosUseCase } from '../application/listar-movimientos.use-case';
import {
  CLAVE_STOCK_MINIMO_GLOBAL,
  STOCK_MINIMO_POR_DEFECTO,
} from '../application/listar-productos-poco-stock.use-case';
import { ObtenerConfiguracionUseCase } from '../application/obtener-configuracion.use-case';
import { RegistrarAjusteUseCase } from '../application/registrar-ajuste.use-case';
import { RegistrarCompraUseCase } from '../application/registrar-compra.use-case';
import { RegistrarPerdidaUseCase } from '../application/registrar-perdida.use-case';
import { ActualizarStockMinimoDto } from './dto/actualizar-stock-minimo.dto';
import { ListarMovimientosQueryDto } from './dto/listar-movimientos-query.dto';
import { RegistrarAjusteDto } from './dto/registrar-ajuste.dto';
import { RegistrarCompraDto } from './dto/registrar-compra.dto';
import { RegistrarPerdidaDto } from './dto/registrar-perdida.dto';

interface RequestConUsuario extends Request {
  user: UsuarioAutenticado;
}

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventarioController {
  constructor(
    private readonly registrarCompraUseCase: RegistrarCompraUseCase,
    private readonly registrarPerdidaUseCase: RegistrarPerdidaUseCase,
    private readonly registrarAjusteUseCase: RegistrarAjusteUseCase,
    private readonly listarMovimientosUseCase: ListarMovimientosUseCase,
    private readonly obtenerConfiguracionUseCase: ObtenerConfiguracionUseCase,
    private readonly actualizarConfiguracionUseCase: ActualizarConfiguracionUseCase,
  ) {}

  @Post('purchases')
  @UseGuards(PermisosGuard)
  @RequierePermiso('inventario.registrar_compra')
  registrarCompra(@Body() dto: RegistrarCompraDto, @Req() req: RequestConUsuario) {
    return this.registrarCompraUseCase.ejecutar({ ...dto, usuarioId: req.user.sub });
  }

  @Post('losses')
  @UseGuards(PermisosGuard)
  @RequierePermiso('inventario.registrar_perdida')
  registrarPerdida(@Body() dto: RegistrarPerdidaDto, @Req() req: RequestConUsuario) {
    return this.registrarPerdidaUseCase.ejecutar({ ...dto, usuarioId: req.user.sub });
  }

  @Post('adjustments')
  @UseGuards(PermisosGuard)
  @RequierePermiso('inventario.registrar_ajuste')
  registrarAjuste(@Body() dto: RegistrarAjusteDto, @Req() req: RequestConUsuario) {
    return this.registrarAjusteUseCase.ejecutar({ ...dto, usuarioId: req.user.sub });
  }

  @Get('movements')
  listarMovimientos(@Query() query: ListarMovimientosQueryDto) {
    return this.listarMovimientosUseCase.ejecutar({
      tipo: query.tipo,
      desde: query.desde ? new Date(query.desde) : undefined,
      hasta: query.hasta ? new Date(query.hasta) : undefined,
    });
  }

  @Get('config/stock-minimo')
  async obtenerStockMinimo() {
    const valor = await this.obtenerConfiguracionUseCase.ejecutar(CLAVE_STOCK_MINIMO_GLOBAL);
    return { valorMinimo: valor ? parseInt(valor, 10) : STOCK_MINIMO_POR_DEFECTO };
  }

  @Patch('config/stock-minimo')
  @UseGuards(PermisosGuard)
  @RequierePermiso('inventario.editar_configuracion')
  async actualizarStockMinimo(@Body() dto: ActualizarStockMinimoDto) {
    await this.actualizarConfiguracionUseCase.ejecutar({
      clave: CLAVE_STOCK_MINIMO_GLOBAL,
      valor: String(dto.valorMinimo),
    });
    return { valorMinimo: dto.valorMinimo };
  }
}
