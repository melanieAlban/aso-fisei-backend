import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../usuarios/infrastructure/auth/jwt-auth.guard';
import { PermisosGuard } from '../../usuarios/infrastructure/auth/permisos.guard';
import { RequierePermiso } from '../../usuarios/infrastructure/auth/requiere-permiso.decorator';
import { ActualizarProductoUseCase } from '../application/actualizar-producto.use-case';
import { CrearProductoUseCase } from '../application/crear-producto.use-case';
import { ListarProductosPocoStockUseCase } from '../application/listar-productos-poco-stock.use-case';
import { ListarProductosUseCase } from '../application/listar-productos.use-case';
import { ObtenerProductoUseCase } from '../application/obtener-producto.use-case';
import { ActualizarProductoDto } from './dto/actualizar-producto.dto';
import { CrearProductoDto } from './dto/crear-producto.dto';
import { ListarProductosQueryDto } from './dto/listar-productos-query.dto';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductosController {
  constructor(
    private readonly crearProductoUseCase: CrearProductoUseCase,
    private readonly obtenerProductoUseCase: ObtenerProductoUseCase,
    private readonly actualizarProductoUseCase: ActualizarProductoUseCase,
    private readonly listarProductosUseCase: ListarProductosUseCase,
    private readonly listarProductosPocoStockUseCase: ListarProductosPocoStockUseCase,
  ) {}

  @Get()
  @UseGuards(PermisosGuard)
  @RequierePermiso('inventario.listar')
  listar(@Query() query: ListarProductosQueryDto) {
    return this.listarProductosUseCase.ejecutar(query);
  }

  @Post()
  @UseGuards(PermisosGuard)
  @RequierePermiso('inventario.crear_producto')
  crear(@Body() dto: CrearProductoDto) {
    return this.crearProductoUseCase.ejecutar(dto);
  }

  @Get('low-stock')
  listarPocoStock() {
    return this.listarProductosPocoStockUseCase.ejecutar();
  }

  @Get(':id')
  obtener(@Param('id') id: string) {
    return this.obtenerProductoUseCase.ejecutar(id);
  }

  @Patch(':id')
  @UseGuards(PermisosGuard)
  @RequierePermiso('inventario.editar_producto')
  actualizar(@Param('id') id: string, @Body() dto: ActualizarProductoDto) {
    return this.actualizarProductoUseCase.ejecutar({ id, ...dto });
  }
}
