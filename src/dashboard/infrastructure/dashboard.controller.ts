import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../usuarios/infrastructure/auth/jwt-auth.guard';
import { UsuarioAutenticado } from '../../usuarios/infrastructure/auth/jwt-payload.interface';
import { DashboardService } from '../application/dashboard.service';

interface RequestConUsuario extends Request {
  user: UsuarioAutenticado;
}

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  obtener(@Req() req: RequestConUsuario) {
    return this.dashboardService.ejecutar(req.user.sub);
  }
}
