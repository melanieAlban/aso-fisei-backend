import { Module } from '@nestjs/common';
import { UsuariosModule } from '../../usuarios/infrastructure/usuarios.module';
import { AuditoriaContextService } from '../../shared/infraestructure/auditoria/auditoria-context.service';
import { CrearDeudaUseCase } from '../application/crear-deuda.use-case';
import { ListarDeudasUseCase } from '../application/listar-deudas.use-case';
import { ObtenerDeudaUseCase } from '../application/obtener-deuda.use-case';
import { DeudaTransaccionPort } from '../application/ports/deuda-transaccion.port';
import { RegistrarAbonoUseCase } from '../application/registrar-abono.use-case';
import { DeudaRepository } from '../domain/deuda.repository';
import { DebtsController } from './debts.controller';
import { DeudaTransaccionPrisma } from './deuda-transaccion.prisma';
import { DeudaRepositoryPrisma } from './deuda.repository.prisma';

@Module({
  imports: [UsuariosModule],
  controllers: [DebtsController],
  providers: [
    { provide: 'DeudaRepository', useClass: DeudaRepositoryPrisma },
    { provide: 'DeudaTransaccionPort', useClass: DeudaTransaccionPrisma },
    {
      provide: CrearDeudaUseCase,
      useFactory: (repo: DeudaRepository) => new CrearDeudaUseCase(repo),
      inject: ['DeudaRepository'],
    },
    {
      provide: ObtenerDeudaUseCase,
      useFactory: (repo: DeudaRepository) => new ObtenerDeudaUseCase(repo),
      inject: ['DeudaRepository'],
    },
    {
      provide: ListarDeudasUseCase,
      useFactory: (repo: DeudaRepository) => new ListarDeudasUseCase(repo),
      inject: ['DeudaRepository'],
    },
    {
      provide: RegistrarAbonoUseCase,
      useFactory: (
        transaccion: DeudaTransaccionPort,
        repo: DeudaRepository,
        auditoria: AuditoriaContextService,
      ) => new RegistrarAbonoUseCase(transaccion, repo, auditoria),
      inject: ['DeudaTransaccionPort', 'DeudaRepository', AuditoriaContextService],
    },
  ],
})
export class DeudasModule {}
