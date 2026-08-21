import { Module } from '@nestjs/common';
import { UsuariosModule } from '../../usuarios/infrastructure/usuarios.module';
import { AuditoriaContextService } from '../../shared/infraestructure/auditoria/auditoria-context.service';
import { AnularGastoUseCase } from '../application/anular-gasto.use-case';
import { ListarCategoriasGastoUseCase } from '../application/listar-categorias-gasto.use-case';
import { ListarGastosUseCase } from '../application/listar-gastos.use-case';
import { GastoTransaccionPort } from '../application/ports/gasto-transaccion.port';
import { RegistrarGastoUseCase } from '../application/registrar-gasto.use-case';
import { GastoRepository } from '../domain/gasto.repository';
import { ExpenseCategoriesController } from './expense-categories.controller';
import { ExpensesController } from './expenses.controller';
import { GastoTransaccionPrisma } from './gasto-transaccion.prisma';
import { GastoRepositoryPrisma } from './gasto.repository.prisma';

@Module({
  imports: [UsuariosModule],
  controllers: [ExpensesController, ExpenseCategoriesController],
  providers: [
    { provide: 'GastoRepository', useClass: GastoRepositoryPrisma },
    { provide: 'GastoTransaccionPort', useClass: GastoTransaccionPrisma },
    {
      provide: RegistrarGastoUseCase,
      useFactory: (transaccion: GastoTransaccionPort) => new RegistrarGastoUseCase(transaccion),
      inject: ['GastoTransaccionPort'],
    },
    {
      provide: AnularGastoUseCase,
      useFactory: (
        transaccion: GastoTransaccionPort,
        repo: GastoRepository,
        auditoria: AuditoriaContextService,
      ) => new AnularGastoUseCase(transaccion, repo, auditoria),
      inject: ['GastoTransaccionPort', 'GastoRepository', AuditoriaContextService],
    },
    {
      provide: ListarGastosUseCase,
      useFactory: (repo: GastoRepository) => new ListarGastosUseCase(repo),
      inject: ['GastoRepository'],
    },
    {
      provide: ListarCategoriasGastoUseCase,
      useFactory: (repo: GastoRepository) => new ListarCategoriasGastoUseCase(repo),
      inject: ['GastoRepository'],
    },
  ],
})
export class GastosModule {}
