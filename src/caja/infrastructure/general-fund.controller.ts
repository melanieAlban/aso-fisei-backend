import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../usuarios/infrastructure/auth/jwt-auth.guard';
import { UsuarioAutenticado } from '../../usuarios/infrastructure/auth/jwt-payload.interface';
import { PermisosGuard } from '../../usuarios/infrastructure/auth/permisos.guard';
import { RequierePermiso } from '../../usuarios/infrastructure/auth/requiere-permiso.decorator';
import { AjustarSaldoInicialFondoUseCase } from '../application/ajustar-saldo-inicial-fondo.use-case';
import { ListarMovimientosFondoGeneralUseCase } from '../application/listar-movimientos-fondo-general.use-case';
import { ObtenerSaldoFondoGeneralUseCase } from '../application/obtener-saldo-fondo-general.use-case';
import { AjustarSaldoInicialDto } from './dto/ajustar-saldo-inicial.dto';
import { ListarLedgerQueryDto } from './dto/listar-ledger-query.dto';

interface RequestConUsuario extends Request {
  user: UsuarioAutenticado;
}

@Controller('general-fund')
@UseGuards(JwtAuthGuard)
export class GeneralFundController {
  constructor(
    private readonly obtenerSaldoFondoGeneralUseCase: ObtenerSaldoFondoGeneralUseCase,
    private readonly listarMovimientosFondoGeneralUseCase: ListarMovimientosFondoGeneralUseCase,
    private readonly ajustarSaldoInicialFondoUseCase: AjustarSaldoInicialFondoUseCase,
  ) {}

  @Get('balance')
  @UseGuards(PermisosGuard)
  @RequierePermiso('fondo_general.ver')
  balance() {
    return this.obtenerSaldoFondoGeneralUseCase.ejecutar();
  }

  @Get('ledger')
  @UseGuards(PermisosGuard)
  @RequierePermiso('fondo_general.ver')
  ledger(@Query() query: ListarLedgerQueryDto) {
    return this.listarMovimientosFondoGeneralUseCase.ejecutar(query);
  }

  @Post('initial-balance-adjustment')
  @UseGuards(PermisosGuard)
  @RequierePermiso('fondo_general.ajustar')
  ajustarSaldoInicial(@Body() dto: AjustarSaldoInicialDto, @Req() req: RequestConUsuario) {
    return this.ajustarSaldoInicialFondoUseCase.ejecutar({
      usuarioId: req.user.sub,
      montoEfectivo: dto.montoEfectivo,
      montoTransferencia: dto.montoTransferencia,
      justificacion: dto.justificacion,
    });
  }
}
