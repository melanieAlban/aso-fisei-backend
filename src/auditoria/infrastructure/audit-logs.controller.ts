import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../usuarios/infrastructure/auth/jwt-auth.guard';
import { PermisosGuard } from '../../usuarios/infrastructure/auth/permisos.guard';
import { RequierePermiso } from '../../usuarios/infrastructure/auth/requiere-permiso.decorator';
import { AuditoriaService } from '../application/auditoria.service';
import { ListarAuditLogsQueryDto } from './dto/listar-audit-logs-query.dto';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard)
export class AuditLogsController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  @Get()
  @UseGuards(PermisosGuard)
  @RequierePermiso('auditoria.listar')
  listar(@Query() query: ListarAuditLogsQueryDto) {
    return this.auditoriaService.listar({
      usuarioId: query.usuarioId,
      modulo: query.modulo,
      accion: query.accion,
      desde: query.desde ? new Date(query.desde) : undefined,
      hasta: query.hasta ? new Date(query.hasta) : undefined,
      page: query.page,
      limit: query.limit,
    });
  }
}
