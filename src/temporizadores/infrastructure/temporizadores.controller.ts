import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UsuarioAutenticado } from '../../usuarios/infrastructure/auth/jwt-payload.interface';
import { JwtAuthGuard } from '../../usuarios/infrastructure/auth/jwt-auth.guard';
import { CrearTemporizadorUseCase } from '../application/crear-temporizador.use-case';
import { EliminarTemporizadorUseCase } from '../application/eliminar-temporizador.use-case';
import { ListarTemporizadoresUseCase } from '../application/listar-temporizadores.use-case';
import { CrearTemporizadorDto } from './dto/crear-temporizador.dto';

interface RequestConUsuario extends Request {
  user: UsuarioAutenticado;
}

@Controller('timers')
@UseGuards(JwtAuthGuard)
export class TemporizadoresController {
  constructor(
    private readonly crearTemporizadorUseCase: CrearTemporizadorUseCase,
    private readonly listarTemporizadoresUseCase: ListarTemporizadoresUseCase,
    private readonly eliminarTemporizadorUseCase: EliminarTemporizadorUseCase,
  ) {}

  @Post()
  crear(@Body() dto: CrearTemporizadorDto, @Req() req: RequestConUsuario) {
    return this.crearTemporizadorUseCase.ejecutar({
      nombre: dto.nombre,
      horaInicio: new Date(dto.horaInicio),
      horaFin: new Date(dto.horaFin),
      usuarioId: req.user.sub,
    });
  }

  @Get()
  listar() {
    return this.listarTemporizadoresUseCase.ejecutar();
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.eliminarTemporizadorUseCase.ejecutar(id);
  }
}
