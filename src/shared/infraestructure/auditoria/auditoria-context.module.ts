import { Global, Module } from '@nestjs/common';
import { AuditoriaContextService } from './auditoria-context.service';

@Global()
@Module({
  providers: [AuditoriaContextService],
  exports: [AuditoriaContextService],
})
export class AuditoriaContextModule {}
