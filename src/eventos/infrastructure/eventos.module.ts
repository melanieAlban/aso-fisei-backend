import { Module } from '@nestjs/common';
import { UsuariosModule } from '../../usuarios/infrastructure/usuarios.module';
import { ActualizarAsignacionEntradasUseCase } from '../application/actualizar-asignacion-entradas.use-case';
import { CerrarEventoUseCase } from '../application/cerrar-evento.use-case';
import { CrearAsignacionEntradasUseCase } from '../application/crear-asignacion-entradas.use-case';
import { CrearEventoUseCase } from '../application/crear-evento.use-case';
import { CrearTipoEntradaUseCase } from '../application/crear-tipo-entrada.use-case';
import { ListarAsignacionesUseCase } from '../application/listar-asignaciones.use-case';
import { ListarEventosUseCase } from '../application/listar-eventos.use-case';
import { ListarTiposEntradaUseCase } from '../application/listar-tipos-entrada.use-case';
import { ObtenerEventoUseCase } from '../application/obtener-evento.use-case';
import { ObtenerResumenEventoUseCase } from '../application/obtener-resumen-evento.use-case';
import { EventoTransaccionPort } from '../application/ports/evento-transaccion.port';
import { RegistrarGastoEventoUseCase } from '../application/registrar-gasto-evento.use-case';
import { RegistrarIngresoEventoUseCase } from '../application/registrar-ingreso-evento.use-case';
import { AsignacionEntradasRepository } from '../domain/asignacion-entradas.repository';
import { EventoRepository } from '../domain/evento.repository';
import { GastoEventoRepository } from '../domain/gasto-evento.repository';
import { IngresoEventoRepository } from '../domain/ingreso-evento.repository';
import { TipoEntradaRepository } from '../domain/tipo-entrada.repository';
import { AsignacionEntradasRepositoryPrisma } from './asignacion-entradas.repository.prisma';
import { EventoRepositoryPrisma } from './evento.repository.prisma';
import { EventoTransaccionPrisma } from './evento-transaccion.prisma';
import { EventsController } from './events.controller';
import { GastoEventoRepositoryPrisma } from './gasto-evento.repository.prisma';
import { IngresoEventoRepositoryPrisma } from './ingreso-evento.repository.prisma';
import { TicketAssignmentsController } from './ticket-assignments.controller';
import { TipoEntradaRepositoryPrisma } from './tipo-entrada.repository.prisma';

@Module({
  imports: [UsuariosModule],
  controllers: [EventsController, TicketAssignmentsController],
  providers: [
    { provide: 'EventoRepository', useClass: EventoRepositoryPrisma },
    { provide: 'TipoEntradaRepository', useClass: TipoEntradaRepositoryPrisma },
    { provide: 'AsignacionEntradasRepository', useClass: AsignacionEntradasRepositoryPrisma },
    { provide: 'IngresoEventoRepository', useClass: IngresoEventoRepositoryPrisma },
    { provide: 'GastoEventoRepository', useClass: GastoEventoRepositoryPrisma },
    { provide: 'EventoTransaccionPort', useClass: EventoTransaccionPrisma },
    {
      provide: CrearEventoUseCase,
      useFactory: (repo: EventoRepository) => new CrearEventoUseCase(repo),
      inject: ['EventoRepository'],
    },
    {
      provide: ListarEventosUseCase,
      useFactory: (repo: EventoRepository) => new ListarEventosUseCase(repo),
      inject: ['EventoRepository'],
    },
    {
      provide: ObtenerEventoUseCase,
      useFactory: (repo: EventoRepository) => new ObtenerEventoUseCase(repo),
      inject: ['EventoRepository'],
    },
    {
      provide: CrearTipoEntradaUseCase,
      useFactory: (tipoRepo: TipoEntradaRepository, eventoRepo: EventoRepository) =>
        new CrearTipoEntradaUseCase(tipoRepo, eventoRepo),
      inject: ['TipoEntradaRepository', 'EventoRepository'],
    },
    {
      provide: ListarTiposEntradaUseCase,
      useFactory: (repo: TipoEntradaRepository) => new ListarTiposEntradaUseCase(repo),
      inject: ['TipoEntradaRepository'],
    },
    {
      provide: CrearAsignacionEntradasUseCase,
      useFactory: (
        asignacionRepo: AsignacionEntradasRepository,
        tipoRepo: TipoEntradaRepository,
        eventoRepo: EventoRepository,
      ) => new CrearAsignacionEntradasUseCase(asignacionRepo, tipoRepo, eventoRepo),
      inject: ['AsignacionEntradasRepository', 'TipoEntradaRepository', 'EventoRepository'],
    },
    {
      provide: ActualizarAsignacionEntradasUseCase,
      useFactory: (
        asignacionRepo: AsignacionEntradasRepository,
        tipoRepo: TipoEntradaRepository,
        eventoRepo: EventoRepository,
      ) => new ActualizarAsignacionEntradasUseCase(asignacionRepo, tipoRepo, eventoRepo),
      inject: ['AsignacionEntradasRepository', 'TipoEntradaRepository', 'EventoRepository'],
    },
    {
      provide: ListarAsignacionesUseCase,
      useFactory: (repo: AsignacionEntradasRepository) => new ListarAsignacionesUseCase(repo),
      inject: ['AsignacionEntradasRepository'],
    },
    {
      provide: RegistrarIngresoEventoUseCase,
      useFactory: (ingresoRepo: IngresoEventoRepository, eventoRepo: EventoRepository) =>
        new RegistrarIngresoEventoUseCase(ingresoRepo, eventoRepo),
      inject: ['IngresoEventoRepository', 'EventoRepository'],
    },
    {
      provide: RegistrarGastoEventoUseCase,
      useFactory: (gastoRepo: GastoEventoRepository, eventoRepo: EventoRepository) =>
        new RegistrarGastoEventoUseCase(gastoRepo, eventoRepo),
      inject: ['GastoEventoRepository', 'EventoRepository'],
    },
    {
      provide: ObtenerResumenEventoUseCase,
      useFactory: (
        eventoRepo: EventoRepository,
        ingresoRepo: IngresoEventoRepository,
        gastoRepo: GastoEventoRepository,
        asignacionRepo: AsignacionEntradasRepository,
      ) => new ObtenerResumenEventoUseCase(eventoRepo, ingresoRepo, gastoRepo, asignacionRepo),
      inject: [
        'EventoRepository',
        'IngresoEventoRepository',
        'GastoEventoRepository',
        'AsignacionEntradasRepository',
      ],
    },
    {
      provide: CerrarEventoUseCase,
      useFactory: (transaccion: EventoTransaccionPort) => new CerrarEventoUseCase(transaccion),
      inject: ['EventoTransaccionPort'],
    },
  ],
})
export class EventosModule {}
