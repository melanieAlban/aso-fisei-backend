import { Module } from '@nestjs/common';
import { UsuariosModule } from '../../usuarios/infrastructure/usuarios.module';
import { AuditoriaService } from '../application/auditoria.service';
import { AuditLogsController } from './audit-logs.controller';

@Module({
  imports: [UsuariosModule],
  controllers: [AuditLogsController],
  providers: [AuditoriaService],
})
export class AuditoriaModule {}
