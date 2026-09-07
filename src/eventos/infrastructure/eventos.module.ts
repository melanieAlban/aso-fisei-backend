import { Module } from '@nestjs/common';
import { UsuariosModule } from '../../usuarios/infrastructure/usuarios.module';
import { AuditoriaContextService } from '../../shared/infraestructure/auditoria/auditoria-context.service';
import { ActualizarAsignacionEntradasUseCase } from '../application/actualizar-asignacion-entradas.use-case';
import { AnularEventoUseCase } from '../application/anular-evento.use-case';
import { CerrarEventoUseCase } from '../application/cerrar-evento.use-case';
import { CrearAsignacionEntradasUseCase } from '../application/crear-asignacion-entradas.use-case';
import { CrearEventoUseCase } from '../application/crear-evento.use-case';
import { CrearTipoEntradaUseCase } from '../application/crear-tipo-entrada.use-case';
import { EditarEventoUseCase } from '../application/editar-evento.use-case';
import { EditarGastoEventoUseCase } from '../application/editar-gasto-evento.use-case';
import { EditarIngresoEventoUseCase } from '../application/editar-ingreso-evento.use-case';
import { EditarTipoEntradaUseCase } from '../application/editar-tipo-entrada.use-case';
import { EliminarAsignacionEntradasUseCase } from '../application/eliminar-asignacion-entradas.use-case';
import { EliminarGastoEventoUseCase } from '../application/eliminar-gasto-evento.use-case';
import { EliminarIngresoEventoUseCase } from '../application/eliminar-ingreso-evento.use-case';
import { EliminarTipoEntradaUseCase } from '../application/eliminar-tipo-entrada.use-case';
import { ListarAsignacionesUseCase } from '../application/listar-asignaciones.use-case';
import { ListarEventosUseCase } from '../application/listar-eventos.use-case';
import { ListarGastosEventoUseCase } from '../application/listar-gastos-evento.use-case';
import { ListarIngresosEventoUseCase } from '../application/listar-ingresos-evento.use-case';
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
    {
      provide: EditarEventoUseCase,
      useFactory: (repo: EventoRepository, auditoria: AuditoriaContextService) =>
        new EditarEventoUseCase(repo, auditoria),
      inject: ['EventoRepository', AuditoriaContextService],
    },
    {
      provide: AnularEventoUseCase,
      useFactory: (repo: EventoRepository, auditoria: AuditoriaContextService) =>
        new AnularEventoUseCase(repo, auditoria),
      inject: ['EventoRepository', AuditoriaContextService],
    },
    {
      provide: ListarIngresosEventoUseCase,
      useFactory: (repo: IngresoEventoRepository) => new ListarIngresosEventoUseCase(repo),
      inject: ['IngresoEventoRepository'],
    },
    {
      provide: ListarGastosEventoUseCase,
      useFactory: (repo: GastoEventoRepository) => new ListarGastosEventoUseCase(repo),
      inject: ['GastoEventoRepository'],
    },
    {
      provide: EditarTipoEntradaUseCase,
      useFactory: (tipoRepo: TipoEntradaRepository, eventoRepo: EventoRepository) =>
        new EditarTipoEntradaUseCase(tipoRepo, eventoRepo),
      inject: ['TipoEntradaRepository', 'EventoRepository'],
    },
    {
      provide: EditarIngresoEventoUseCase,
      useFactory: (ingresoRepo: IngresoEventoRepository, eventoRepo: EventoRepository) =>
        new EditarIngresoEventoUseCase(ingresoRepo, eventoRepo),
      inject: ['IngresoEventoRepository', 'EventoRepository'],
    },
    {
      provide: EditarGastoEventoUseCase,
      useFactory: (gastoRepo: GastoEventoRepository, eventoRepo: EventoRepository) =>
        new EditarGastoEventoUseCase(gastoRepo, eventoRepo),
      inject: ['GastoEventoRepository', 'EventoRepository'],
    },
    {
      provide: EliminarTipoEntradaUseCase,
      useFactory: (tipoRepo: TipoEntradaRepository, eventoRepo: EventoRepository) =>
        new EliminarTipoEntradaUseCase(tipoRepo, eventoRepo),
      inject: ['TipoEntradaRepository', 'EventoRepository'],
    },
    {
      provide: EliminarAsignacionEntradasUseCase,
      useFactory: (
        asignacionRepo: AsignacionEntradasRepository,
        tipoRepo: TipoEntradaRepository,
        eventoRepo: EventoRepository,
      ) => new EliminarAsignacionEntradasUseCase(asignacionRepo, tipoRepo, eventoRepo),
      inject: ['AsignacionEntradasRepository', 'TipoEntradaRepository', 'EventoRepository'],
    },
    {
      provide: EliminarIngresoEventoUseCase,
      useFactory: (ingresoRepo: IngresoEventoRepository, eventoRepo: EventoRepository) =>
        new EliminarIngresoEventoUseCase(ingresoRepo, eventoRepo),
      inject: ['IngresoEventoRepository', 'EventoRepository'],
    },
    {
      provide: EliminarGastoEventoUseCase,
      useFactory: (gastoRepo: GastoEventoRepository, eventoRepo: EventoRepository) =>
        new EliminarGastoEventoUseCase(gastoRepo, eventoRepo),
      inject: ['GastoEventoRepository', 'EventoRepository'],
    },
  ],
})
export class EventosModule {}
