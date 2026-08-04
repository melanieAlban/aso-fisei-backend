import { Module } from '@nestjs/common';
import { UsuariosModule } from '../../usuarios/infrastructure/usuarios.module';
import { ActualizarConfiguracionUseCase } from '../application/actualizar-configuracion.use-case';
import { ActualizarProductoUseCase } from '../application/actualizar-producto.use-case';
import { CrearProductoUseCase } from '../application/crear-producto.use-case';
import { ListarMovimientosUseCase } from '../application/listar-movimientos.use-case';
import { ListarProductosPocoStockUseCase } from '../application/listar-productos-poco-stock.use-case';
import { ListarProductosUseCase } from '../application/listar-productos.use-case';
import { ObtenerConfiguracionUseCase } from '../application/obtener-configuracion.use-case';
import { ObtenerProductoUseCase } from '../application/obtener-producto.use-case';
import { InventarioTransaccionPort } from '../application/ports/inventario-transaccion.port';
import { RegistrarAjusteUseCase } from '../application/registrar-ajuste.use-case';
import { RegistrarCompraUseCase } from '../application/registrar-compra.use-case';
import { RegistrarPerdidaUseCase } from '../application/registrar-perdida.use-case';
import { ConfiguracionSistemaRepository } from '../domain/configuracion-sistema.repository';
import { MovimientoInventarioRepository } from '../domain/movimiento-inventario.repository';
import { ProductoRepository } from '../domain/producto.repository';
import { ConfiguracionSistemaRepositoryPrisma } from './configuracion-sistema.repository.prisma';
import { InventarioController } from './inventario.controller';
import { InventarioTransaccionPrisma } from './inventario-transaccion.prisma';
import { MovimientoInventarioRepositoryPrisma } from './movimiento-inventario.repository.prisma';
import { ProductoRepositoryPrisma } from './producto.repository.prisma';
import { ProductosController } from './productos.controller';

@Module({
  imports: [UsuariosModule],
  controllers: [ProductosController, InventarioController],
  providers: [
    { provide: 'ProductoRepository', useClass: ProductoRepositoryPrisma },
    { provide: 'MovimientoInventarioRepository', useClass: MovimientoInventarioRepositoryPrisma },
    { provide: 'ConfiguracionSistemaRepository', useClass: ConfiguracionSistemaRepositoryPrisma },
    { provide: 'InventarioTransaccionPort', useClass: InventarioTransaccionPrisma },
    {
      provide: CrearProductoUseCase,
      useFactory: (repo: ProductoRepository) => new CrearProductoUseCase(repo),
      inject: ['ProductoRepository'],
    },
    {
      provide: ObtenerProductoUseCase,
      useFactory: (repo: ProductoRepository) => new ObtenerProductoUseCase(repo),
      inject: ['ProductoRepository'],
    },
    {
      provide: ActualizarProductoUseCase,
      useFactory: (repo: ProductoRepository) => new ActualizarProductoUseCase(repo),
      inject: ['ProductoRepository'],
    },
    {
      provide: ListarProductosUseCase,
      useFactory: (repo: ProductoRepository) => new ListarProductosUseCase(repo),
      inject: ['ProductoRepository'],
    },
    {
      provide: ListarProductosPocoStockUseCase,
      useFactory: (repo: ProductoRepository, config: ConfiguracionSistemaRepository) =>
        new ListarProductosPocoStockUseCase(repo, config),
      inject: ['ProductoRepository', 'ConfiguracionSistemaRepository'],
    },
    {
      provide: ListarMovimientosUseCase,
      useFactory: (repo: MovimientoInventarioRepository) => new ListarMovimientosUseCase(repo),
      inject: ['MovimientoInventarioRepository'],
    },
    {
      provide: ObtenerConfiguracionUseCase,
      useFactory: (config: ConfiguracionSistemaRepository) => new ObtenerConfiguracionUseCase(config),
      inject: ['ConfiguracionSistemaRepository'],
    },
    {
      provide: ActualizarConfiguracionUseCase,
      useFactory: (config: ConfiguracionSistemaRepository) =>
        new ActualizarConfiguracionUseCase(config),
      inject: ['ConfiguracionSistemaRepository'],
    },
    {
      provide: RegistrarCompraUseCase,
      useFactory: (transaccion: InventarioTransaccionPort) => new RegistrarCompraUseCase(transaccion),
      inject: ['InventarioTransaccionPort'],
    },
    {
      provide: RegistrarPerdidaUseCase,
      useFactory: (transaccion: InventarioTransaccionPort) => new RegistrarPerdidaUseCase(transaccion),
      inject: ['InventarioTransaccionPort'],
    },
    {
      provide: RegistrarAjusteUseCase,
      useFactory: (transaccion: InventarioTransaccionPort) => new RegistrarAjusteUseCase(transaccion),
      inject: ['InventarioTransaccionPort'],
    },
  ],
})
export class InventarioModule {}
