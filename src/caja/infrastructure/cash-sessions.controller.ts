import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../usuarios/infrastructure/auth/jwt-auth.guard';
import { UsuarioAutenticado } from '../../usuarios/infrastructure/auth/jwt-payload.interface';
import { PermisosGuard } from '../../usuarios/infrastructure/auth/permisos.guard';
import { RequierePermiso } from '../../usuarios/infrastructure/auth/requiere-permiso.decorator';
import { AbrirCajaUseCase } from '../application/abrir-caja.use-case';
import { ClasificarDiferenciaArqueoUseCase } from '../application/clasificar-diferencia-arqueo.use-case';
import { ObtenerCajaActualUseCase } from '../application/obtener-caja-actual.use-case';
import { RealizarArqueoUseCase } from '../application/realizar-arqueo.use-case';
import { ResumenDiarioUseCase } from '../application/resumen-diario.use-case';
import { AbrirCajaDto } from './dto/abrir-caja.dto';
import { ClasificarDiferenciaDto } from './dto/clasificar-diferencia.dto';
import { RealizarArqueoDto } from './dto/realizar-arqueo.dto';

interface RequestConUsuario extends Request {
  user: UsuarioAutenticado;
}

@Controller('cash-sessions')
@UseGuards(JwtAuthGuard)
export class CashSessionsController {
  constructor(
    private readonly abrirCajaUseCase: AbrirCajaUseCase,
    private readonly obtenerCajaActualUseCase: ObtenerCajaActualUseCase,
    private readonly resumenDiarioUseCase: ResumenDiarioUseCase,
    private readonly realizarArqueoUseCase: RealizarArqueoUseCase,
    private readonly clasificarDiferenciaArqueoUseCase: ClasificarDiferenciaArqueoUseCase,
  ) {}

  @Post('open')
  @UseGuards(PermisosGuard)
  @RequierePermiso('caja.abrir')
  abrir(@Body() dto: AbrirCajaDto, @Req() req: RequestConUsuario) {
    return this.abrirCajaUseCase.ejecutar({
      usuarioId: req.user.sub,
      fondoInicialEfectivo: dto.fondoInicialEfectivo,
    });
  }

  @Get('current')
  actual() {
    return this.obtenerCajaActualUseCase.ejecutar();
  }

  @Get(':id/daily-summary')
  resumenDiario(@Param('id') id: string) {
    return this.resumenDiarioUseCase.ejecutar(id);
  }

  @Post(':id/reconciliation')
  @UseGuards(PermisosGuard)
  @RequierePermiso('caja.arqueo')
  realizarArqueo(
    @Param('id') id: string,
    @Body() dto: RealizarArqueoDto,
    @Req() req: RequestConUsuario,
  ) {
    return this.realizarArqueoUseCase.ejecutar({
      cajaId: id,
      usuarioId: req.user.sub,
      ...dto,
    });
  }

  @Patch('reconciliations/:id/classify-difference')
  @UseGuards(PermisosGuard)
  @RequierePermiso('caja.arqueo')
  clasificarDiferencia(@Param('id') id: string, @Body() dto: ClasificarDiferenciaDto) {
    return this.clasificarDiferenciaArqueoUseCase.ejecutar({
      arqueoId: id,
      clasificacion: dto.clasificacion,
    });
  }
}
