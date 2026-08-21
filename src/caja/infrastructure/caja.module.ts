import { Module } from '@nestjs/common';
import { UsuariosModule } from '../../usuarios/infrastructure/usuarios.module';
import { AuditoriaContextService } from '../../shared/infraestructure/auditoria/auditoria-context.service';
import { AbrirCajaUseCase } from '../application/abrir-caja.use-case';
import { AjustarSaldoInicialFondoUseCase } from '../application/ajustar-saldo-inicial-fondo.use-case';
import { AnularItemVentaUseCase } from '../application/anular-item-venta.use-case';
import { ClasificarDiferenciaArqueoUseCase } from '../application/clasificar-diferencia-arqueo.use-case';
import { DevolverAlquilerUseCase } from '../application/devolver-alquiler.use-case';
import { ListarMovimientosFondoGeneralUseCase } from '../application/listar-movimientos-fondo-general.use-case';
import { ListarVentasUseCase } from '../application/listar-ventas.use-case';
import { ObtenerCajaActualUseCase } from '../application/obtener-caja-actual.use-case';
import { ObtenerSaldoFondoGeneralUseCase } from '../application/obtener-saldo-fondo-general.use-case';
import { ObtenerVentaUseCase } from '../application/obtener-venta.use-case';
import { CajaTransaccionPort } from '../application/ports/caja-transaccion.port';
import { RealizarArqueoUseCase } from '../application/realizar-arqueo.use-case';
import { RegistrarVentaUseCase } from '../application/registrar-venta.use-case';
import { ResumenDiarioUseCase } from '../application/resumen-diario.use-case';
import { ArqueoCajaRepository } from '../domain/arqueo-caja.repository';
import { CajaRepository } from '../domain/caja.repository';
import { FondoGeneralRepository } from '../domain/fondo-general.repository';
import { VentaRepository } from '../domain/venta.repository';
import { ArqueoCajaRepositoryPrisma } from './arqueo-caja.repository.prisma';
import { CajaRepositoryPrisma } from './caja.repository.prisma';
import { CajaTransaccionPrisma } from './caja-transaccion.prisma';
import { CashSessionsController } from './cash-sessions.controller';
import { FondoGeneralRepositoryPrisma } from './fondo-general.repository.prisma';
import { GeneralFundController } from './general-fund.controller';
import { SalesController } from './sales.controller';
import { VentaRepositoryPrisma } from './venta.repository.prisma';

@Module({
  imports: [UsuariosModule],
  controllers: [CashSessionsController, GeneralFundController, SalesController],
  providers: [
    { provide: 'CajaRepository', useClass: CajaRepositoryPrisma },
    { provide: 'ArqueoCajaRepository', useClass: ArqueoCajaRepositoryPrisma },
    { provide: 'VentaRepository', useClass: VentaRepositoryPrisma },
    { provide: 'FondoGeneralRepository', useClass: FondoGeneralRepositoryPrisma },
    { provide: 'CajaTransaccionPort', useClass: CajaTransaccionPrisma },
    {
      provide: AbrirCajaUseCase,
      useFactory: (transaccion: CajaTransaccionPort) => new AbrirCajaUseCase(transaccion),
      inject: ['CajaTransaccionPort'],
    },
    {
      provide: ObtenerCajaActualUseCase,
      useFactory: (repo: CajaRepository) => new ObtenerCajaActualUseCase(repo),
      inject: ['CajaRepository'],
    },
    {
      provide: ResumenDiarioUseCase,
      useFactory: (cajaRepo: CajaRepository, ventaRepo: VentaRepository) =>
        new ResumenDiarioUseCase(cajaRepo, ventaRepo),
      inject: ['CajaRepository', 'VentaRepository'],
    },
    {
      provide: RealizarArqueoUseCase,
      useFactory: (
        transaccion: CajaTransaccionPort,
        cajaRepo: CajaRepository,
        auditoria: AuditoriaContextService,
      ) => new RealizarArqueoUseCase(transaccion, cajaRepo, auditoria),
      inject: ['CajaTransaccionPort', 'CajaRepository', AuditoriaContextService],
    },
    {
      provide: ClasificarDiferenciaArqueoUseCase,
      useFactory: (repo: ArqueoCajaRepository, auditoria: AuditoriaContextService) =>
        new ClasificarDiferenciaArqueoUseCase(repo, auditoria),
      inject: ['ArqueoCajaRepository', AuditoriaContextService],
    },
    {
      provide: ObtenerSaldoFondoGeneralUseCase,
      useFactory: (repo: FondoGeneralRepository) => new ObtenerSaldoFondoGeneralUseCase(repo),
      inject: ['FondoGeneralRepository'],
    },
    {
      provide: ListarMovimientosFondoGeneralUseCase,
      useFactory: (repo: FondoGeneralRepository) => new ListarMovimientosFondoGeneralUseCase(repo),
      inject: ['FondoGeneralRepository'],
    },
    {
      provide: AjustarSaldoInicialFondoUseCase,
      useFactory: (transaccion: CajaTransaccionPort) =>
        new AjustarSaldoInicialFondoUseCase(transaccion),
      inject: ['CajaTransaccionPort'],
    },
    {
      provide: RegistrarVentaUseCase,
      useFactory: (transaccion: CajaTransaccionPort) => new RegistrarVentaUseCase(transaccion),
      inject: ['CajaTransaccionPort'],
    },
    {
      provide: ListarVentasUseCase,
      useFactory: (repo: VentaRepository) => new ListarVentasUseCase(repo),
      inject: ['VentaRepository'],
    },
    {
      provide: ObtenerVentaUseCase,
      useFactory: (repo: VentaRepository) => new ObtenerVentaUseCase(repo),
      inject: ['VentaRepository'],
    },
    {
      provide: AnularItemVentaUseCase,
      useFactory: (
        transaccion: CajaTransaccionPort,
        ventaRepo: VentaRepository,
        auditoria: AuditoriaContextService,
      ) => new AnularItemVentaUseCase(transaccion, ventaRepo, auditoria),
      inject: ['CajaTransaccionPort', 'VentaRepository', AuditoriaContextService],
    },
    {
      provide: DevolverAlquilerUseCase,
      useFactory: (repo: VentaRepository) => new DevolverAlquilerUseCase(repo),
      inject: ['VentaRepository'],
    },
  ],
})
export class CajaModule {}
