import { Module } from '@nestjs/common';
import { UsuariosModule } from '../../usuarios/infrastructure/usuarios.module';
import { DashboardService } from '../application/dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [UsuariosModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
