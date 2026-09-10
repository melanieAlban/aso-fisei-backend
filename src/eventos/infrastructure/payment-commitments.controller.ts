import { Body, Controller, Delete, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../usuarios/infrastructure/auth/jwt-auth.guard';
import { PermisosGuard } from '../../usuarios/infrastructure/auth/permisos.guard';
import { RequierePermiso } from '../../usuarios/infrastructure/auth/requiere-permiso.decorator';
import { UsuarioAutenticado } from '../../usuarios/infrastructure/auth/jwt-payload.interface';
import { EliminarCompromisoPagoUseCase } from '../application/eliminar-compromiso-pago.use-case';
import { RegistrarAbonoCompromisoUseCase } from '../application/registrar-abono-compromiso.use-case';
import { RegistrarAbonoCompromisoDto } from './dto/registrar-abono-compromiso.dto';

interface RequestConUsuario extends Request {
  user: UsuarioAutenticado;
}

@Controller('payment-commitments')
@UseGuards(JwtAuthGuard)
export class PaymentCommitmentsController {
  constructor(
    private readonly registrarAbonoCompromisoUseCase: RegistrarAbonoCompromisoUseCase,
    private readonly eliminarCompromisoPagoUseCase: EliminarCompromisoPagoUseCase,
  ) {}

  @Post(':id/payments')
  @UseGuards(PermisosGuard)
  @RequierePermiso('eventos.registrar_movimiento')
  abonar(
    @Param('id') id: string,
    @Body() dto: RegistrarAbonoCompromisoDto,
    @Req() req: RequestConUsuario,
  ) {
    return this.registrarAbonoCompromisoUseCase.ejecutar({
      compromisoId: id,
      usuarioId: req.user.sub,
      monto: dto.monto,
      metodoPago: dto.metodoPago,
    });
  }

  @Delete(':id')
  @UseGuards(PermisosGuard)
  @RequierePermiso('eventos.registrar_movimiento')
  eliminar(@Param('id') id: string) {
    return this.eliminarCompromisoPagoUseCase.ejecutar(id);
  }
}
