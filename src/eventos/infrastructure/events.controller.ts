import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UsuarioAutenticado } from '../../usuarios/infrastructure/auth/jwt-payload.interface';
import { JwtAuthGuard } from '../../usuarios/infrastructure/auth/jwt-auth.guard';
import { PermisosGuard } from '../../usuarios/infrastructure/auth/permisos.guard';
import { RequierePermiso } from '../../usuarios/infrastructure/auth/requiere-permiso.decorator';
import { AnularEventoUseCase } from '../application/anular-evento.use-case';
import { CerrarEventoUseCase } from '../application/cerrar-evento.use-case';
import { CrearAsignacionEntradasUseCase } from '../application/crear-asignacion-entradas.use-case';
import { CrearEventoUseCase } from '../application/crear-evento.use-case';
import { CrearTipoEntradaUseCase } from '../application/crear-tipo-entrada.use-case';
import { EditarEventoUseCase } from '../application/editar-evento.use-case';
import { ListarAsignacionesUseCase } from '../application/listar-asignaciones.use-case';
import { ListarEventosUseCase } from '../application/listar-eventos.use-case';
import { ListarTiposEntradaUseCase } from '../application/listar-tipos-entrada.use-case';
import { ObtenerEventoUseCase } from '../application/obtener-evento.use-case';
import { ObtenerResumenEventoUseCase } from '../application/obtener-resumen-evento.use-case';
import { RegistrarGastoEventoUseCase } from '../application/registrar-gasto-evento.use-case';
import { RegistrarIngresoEventoUseCase } from '../application/registrar-ingreso-evento.use-case';
import { AnularEventoDto } from './dto/anular-evento.dto';
import { CrearAsignacionEntradasDto } from './dto/crear-asignacion-entradas.dto';
import { CrearEventoDto } from './dto/crear-evento.dto';
import { CrearTipoEntradaDto } from './dto/crear-tipo-entrada.dto';
import { EditarEventoDto } from './dto/editar-evento.dto';
import { ListarEventosQueryDto } from './dto/listar-eventos-query.dto';
import { RegistrarGastoEventoDto } from './dto/registrar-gasto-evento.dto';
import { RegistrarIngresoEventoDto } from './dto/registrar-ingreso-evento.dto';

interface RequestConUsuario extends Request {
  user: UsuarioAutenticado;
}

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(
    private readonly crearEventoUseCase: CrearEventoUseCase,
    private readonly listarEventosUseCase: ListarEventosUseCase,
    private readonly obtenerEventoUseCase: ObtenerEventoUseCase,
    private readonly cerrarEventoUseCase: CerrarEventoUseCase,
    private readonly editarEventoUseCase: EditarEventoUseCase,
    private readonly anularEventoUseCase: AnularEventoUseCase,
    private readonly obtenerResumenEventoUseCase: ObtenerResumenEventoUseCase,
    private readonly crearTipoEntradaUseCase: CrearTipoEntradaUseCase,
    private readonly listarTiposEntradaUseCase: ListarTiposEntradaUseCase,
    private readonly crearAsignacionEntradasUseCase: CrearAsignacionEntradasUseCase,
    private readonly listarAsignacionesUseCase: ListarAsignacionesUseCase,
    private readonly registrarIngresoEventoUseCase: RegistrarIngresoEventoUseCase,
    private readonly registrarGastoEventoUseCase: RegistrarGastoEventoUseCase,
  ) {}

  @Post()
  @UseGuards(PermisosGuard)
  @RequierePermiso('eventos.crear')
  crear(@Body() dto: CrearEventoDto) {
    return this.crearEventoUseCase.ejecutar({
      nombre: dto.nombre,
      presupuesto: dto.presupuesto,
      fechaInicio: new Date(dto.fechaInicio),
      fechaFin: dto.fechaFin ? new Date(dto.fechaFin) : undefined,
    });
  }

  @Patch(':id')
  @UseGuards(PermisosGuard)
  @RequierePermiso('eventos.editar')
  editar(@Param('id') id: string, @Body() dto: EditarEventoDto) {
    return this.editarEventoUseCase.ejecutar({
      eventoId: id,
      nombre: dto.nombre,
      presupuesto: dto.presupuesto,
      fechaInicio: dto.fechaInicio ? new Date(dto.fechaInicio) : undefined,
      fechaFin: dto.fechaFin ? new Date(dto.fechaFin) : undefined,
    });
  }

  @Patch(':id/cancel')
  @UseGuards(PermisosGuard)
  @RequierePermiso('eventos.anular')
  anular(@Param('id') id: string, @Body() dto: AnularEventoDto, @Req() req: RequestConUsuario) {
    return this.anularEventoUseCase.ejecutar({ eventoId: id, usuarioId: req.user.sub, motivo: dto.motivo });
  }

  @Get()
  listar(@Query() query: ListarEventosQueryDto) {
    return this.listarEventosUseCase.ejecutar({ page: query.page, limit: query.limit });
  }

  @Get(':id')
  obtener(@Param('id') id: string) {
    return this.obtenerEventoUseCase.ejecutar(id);
  }

  @Patch(':id/close')
  @UseGuards(PermisosGuard)
  @RequierePermiso('eventos.cerrar')
  cerrar(@Param('id') id: string, @Req() req: RequestConUsuario) {
    return this.cerrarEventoUseCase.ejecutar({ eventoId: id, usuarioId: req.user.sub });
  }

  @Get(':id/summary')
  resumen(@Param('id') id: string) {
    return this.obtenerResumenEventoUseCase.ejecutar(id);
  }

  @Post(':id/ticket-types')
  @UseGuards(PermisosGuard)
  @RequierePermiso('eventos.crear')
  crearTipoEntrada(@Param('id') id: string, @Body() dto: CrearTipoEntradaDto) {
    return this.crearTipoEntradaUseCase.ejecutar({
      eventoId: id,
      nombre: dto.nombre,
      precio: dto.precio,
      cantidadTotal: dto.cantidadTotal,
    });
  }

  @Get(':id/ticket-types')
  listarTiposEntrada(@Param('id') id: string) {
    return this.listarTiposEntradaUseCase.ejecutar(id);
  }

  @Post(':id/ticket-assignments')
  @UseGuards(PermisosGuard)
  @RequierePermiso('eventos.gestionar_entradas')
  crearAsignacion(
    @Param('id') id: string,
    @Body() dto: CrearAsignacionEntradasDto,
    @Req() req: RequestConUsuario,
  ) {
    return this.crearAsignacionEntradasUseCase.ejecutar({
      tipoEntradaId: dto.tipoEntradaId,
      usuarioRegistroId: req.user.sub,
      nombreReferencia: dto.nombreReferencia,
      cantidadAsignada: dto.cantidadAsignada,
    });
  }

  @Get(':id/ticket-assignments')
  listarAsignaciones(@Param('id') id: string) {
    return this.listarAsignacionesUseCase.ejecutar(id);
  }

  @Post(':id/income')
  @UseGuards(PermisosGuard)
  @RequierePermiso('eventos.registrar_movimiento')
  registrarIngreso(
    @Param('id') id: string,
    @Body() dto: RegistrarIngresoEventoDto,
    @Req() req: RequestConUsuario,
  ) {
    return this.registrarIngresoEventoUseCase.ejecutar({
      eventoId: id,
      usuarioId: req.user.sub,
      descripcion: dto.descripcion,
      monto: dto.monto,
      metodoPago: dto.metodoPago,
    });
  }

  @Post(':id/expenses')
  @UseGuards(PermisosGuard)
  @RequierePermiso('eventos.registrar_movimiento')
  registrarGasto(
    @Param('id') id: string,
    @Body() dto: RegistrarGastoEventoDto,
    @Req() req: RequestConUsuario,
  ) {
    return this.registrarGastoEventoUseCase.ejecutar({
      eventoId: id,
      usuarioId: req.user.sub,
      descripcion: dto.descripcion,
      monto: dto.monto,
      metodoPago: dto.metodoPago,
    });
  }
}
