import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AllExceptionsFilter } from './shared/infraestructure/filters/all-exceptions.filter';
import { AuditoriaContextMiddleware } from './shared/infraestructure/auditoria/auditoria-context.middleware';
import { AuditoriaContextModule } from './shared/infraestructure/auditoria/auditoria-context.module';
import { AuditoriaInterceptor } from './shared/infraestructure/auditoria/auditoria.interceptor';
import { TransformInterceptor } from './shared/infraestructure/interceptors/transform.interceptor';
import { PrismaModule } from './shared/infraestructure/prisma/prisma.module';
import { AuditoriaModule } from './auditoria/infrastructure/auditoria.module';
import { CajaModule } from './caja/infrastructure/caja.module';
import { DashboardModule } from './dashboard/infrastructure/dashboard.module';
import { DeudasModule } from './deudas/infrastructure/deudas.module';
import { EventosModule } from './eventos/infrastructure/eventos.module';
import { GastosModule } from './gastos/infrastructure/gastos.module';
import { InventarioModule } from './inventario/infrastructure/inventario.module';
import { TemporizadoresModule } from './temporizadores/infrastructure/temporizadores.module';
import { UsuariosModule } from './usuarios/infrastructure/usuarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuditoriaContextModule,
    UsuariosModule,
    InventarioModule,
    CajaModule,
    GastosModule,
    DeudasModule,
    DashboardModule,
    AuditoriaModule,
    EventosModule,
    TemporizadoresModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_INTERCEPTOR, useClass: AuditoriaInterceptor },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuditoriaContextMiddleware).forRoutes('*');
  }
}
