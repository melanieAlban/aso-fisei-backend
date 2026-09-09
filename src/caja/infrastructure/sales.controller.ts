import { Body, Controller, Get, Inject, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UsuarioRolRepository } from '../../usuarios/domain/usuario-rol.repository';
import { JwtAuthGuard } from '../../usuarios/infrastructure/auth/jwt-auth.guard';
import { UsuarioAutenticado } from '../../usuarios/infrastructure/auth/jwt-payload.interface';
import { PermisosGuard } from '../../usuarios/infrastructure/auth/permisos.guard';
import { RequierePermiso } from '../../usuarios/infrastructure/auth/requiere-permiso.decorator';
import { AnularItemVentaUseCase } from '../application/anular-item-venta.use-case';
import { DevolverAlquilerUseCase } from '../application/devolver-alquiler.use-case';
import { ListarVentasUseCase } from '../application/listar-ventas.use-case';
import { ObtenerVentaUseCase } from '../application/obtener-venta.use-case';
import { RegistrarVentaUseCase } from '../application/registrar-venta.use-case';
import { AnularItemDto } from './dto/anular-item.dto';
import { ListarVentasQueryDto } from './dto/listar-ventas-query.dto';
import { RegistrarVentaDto } from './dto/registrar-venta.dto';

interface RequestConUsuario extends Request {
  user: UsuarioAutenticado;
}

@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SalesController {
  constructor(
    private readonly registrarVentaUseCase: RegistrarVentaUseCase,
    private readonly listarVentasUseCase: ListarVentasUseCase,
    private readonly obtenerVentaUseCase: ObtenerVentaUseCase,
    private readonly anularItemVentaUseCase: AnularItemVentaUseCase,
    private readonly devolverAlquilerUseCase: DevolverAlquilerUseCase,
    @Inject('UsuarioRolRepository')
    private readonly usuarioRolRepository: UsuarioRolRepository,
  ) {}

  @Post()
  @UseGuards(PermisosGuard)
  @RequierePermiso('ventas.crear')
  registrar(@Body() dto: RegistrarVentaDto, @Req() req: RequestConUsuario) {
    return this.registrarVentaUseCase.ejecutar({
      usuarioId: req.user.sub,
      montoEfectivo: dto.montoEfectivo,
      montoTransferencia: dto.montoTransferencia,
      lineas: dto.lineas,
    });
  }

  @Get()
  @UseGuards(PermisosGuard)
  @RequierePermiso('ventas.listar')
  async listar(@Query() query: ListarVentasQueryDto, @Req() req: RequestConUsuario) {
    const roles = await this.usuarioRolRepository.listarNombresRolesPorUsuario(req.user.sub);
    const esAdmin = roles.includes('Admin');

    return this.listarVentasUseCase.ejecutar({
      desde: query.from ? new Date(query.from) : undefined,
      hasta: query.to ? new Date(query.to) : undefined,
      // Un vendedor solo ve sus propias ventas; un admin ve las de todos.
      usuarioId: esAdmin ? undefined : req.user.sub,
      page: query.page,
      limit: query.limit,
    });
  }

  @Get(':id')
  obtener(@Param('id') id: string) {
    return this.obtenerVentaUseCase.ejecutar(id);
  }

  @Patch(':id/items/:itemId/void')
  @UseGuards(PermisosGuard)
  @RequierePermiso('ventas.anular')
  anularItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() dto: AnularItemDto,
    @Req() req: RequestConUsuario,
  ) {
    return this.anularItemVentaUseCase.ejecutar({
      ventaId: id,
      itemId,
      motivo: dto.motivo,
      usuarioId: req.user.sub,
    });
  }

  @Patch(':id/items/:itemId/return')
  @UseGuards(PermisosGuard)
  @RequierePermiso('ventas.crear')
  devolverAlquiler(@Param('itemId') itemId: string) {
    return this.devolverAlquilerUseCase.ejecutar(itemId);
  }
}
