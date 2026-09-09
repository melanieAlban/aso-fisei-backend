import { Module } from '@nestjs/common';
import { UsuariosModule } from '../../usuarios/infrastructure/usuarios.module';
import { CrearTemporizadorUseCase } from '../application/crear-temporizador.use-case';
import { EliminarTemporizadorUseCase } from '../application/eliminar-temporizador.use-case';
import { ListarTemporizadoresUseCase } from '../application/listar-temporizadores.use-case';
import { TemporizadorActivoRepository } from '../domain/temporizador-activo.repository';
import { TemporizadorActivoRepositoryPrisma } from './temporizador-activo.repository.prisma';
import { TemporizadoresController } from './temporizadores.controller';

@Module({
  imports: [UsuariosModule],
  controllers: [TemporizadoresController],
  providers: [
    { provide: 'TemporizadorActivoRepository', useClass: TemporizadorActivoRepositoryPrisma },
    {
      provide: CrearTemporizadorUseCase,
      useFactory: (repo: TemporizadorActivoRepository) => new CrearTemporizadorUseCase(repo),
      inject: ['TemporizadorActivoRepository'],
    },
    {
      provide: ListarTemporizadoresUseCase,
      useFactory: (repo: TemporizadorActivoRepository) => new ListarTemporizadoresUseCase(repo),
      inject: ['TemporizadorActivoRepository'],
    },
    {
      provide: EliminarTemporizadorUseCase,
      useFactory: (repo: TemporizadorActivoRepository) => new EliminarTemporizadorUseCase(repo),
      inject: ['TemporizadorActivoRepository'],
    },
  ],
})
export class TemporizadoresModule {}
