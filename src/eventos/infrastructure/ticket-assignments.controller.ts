import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../usuarios/infrastructure/auth/jwt-auth.guard';
import { PermisosGuard } from '../../usuarios/infrastructure/auth/permisos.guard';
import { RequierePermiso } from '../../usuarios/infrastructure/auth/requiere-permiso.decorator';
import { ActualizarAsignacionEntradasUseCase } from '../application/actualizar-asignacion-entradas.use-case';
import { ActualizarAsignacionEntradasDto } from './dto/actualizar-asignacion-entradas.dto';

@Controller('ticket-assignments')
@UseGuards(JwtAuthGuard)
export class TicketAssignmentsController {
  constructor(
    private readonly actualizarAsignacionEntradasUseCase: ActualizarAsignacionEntradasUseCase,
  ) {}

  @Patch(':id')
  @UseGuards(PermisosGuard)
  @RequierePermiso('eventos.gestionar_entradas')
  actualizar(@Param('id') id: string, @Body() dto: ActualizarAsignacionEntradasDto) {
    return this.actualizarAsignacionEntradasUseCase.ejecutar({
      id,
      nombreReferencia: dto.nombreReferencia,
      telefono: dto.telefono,
      semestre: dto.semestre,
      carrera: dto.carrera,
      cantidadAsignada: dto.cantidadAsignada,
      cantidadVendida: dto.cantidadVendida,
      cantidadVendidaCombo: dto.cantidadVendidaCombo,
      cantidadDevuelta: dto.cantidadDevuelta,
      dineroRecibido: dto.dineroRecibido,
      metodoPago: dto.metodoPago,
    });
  }
}
