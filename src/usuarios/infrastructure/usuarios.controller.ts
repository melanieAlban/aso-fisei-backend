import * as bcrypt from 'bcrypt';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ActivarUsuarioUseCase } from '../application/activar-usuario.use-case';
import { AsignarRolUseCase } from '../application/asignar-rol.use-case';
import { Usuario } from '../domain/usuario.entity';
import { UsuarioRolRepository } from '../domain/usuario-rol.repository';
import { CambiarPasswordUseCase } from '../application/cambiar-password.use-case';
import { CrearUsuarioUseCase } from '../application/crear-usuario.use-case';
import { DesactivarUsuarioUseCase } from '../application/desactivar-usuario.use-case';
import { EditarUsuarioUseCase } from '../application/editar-usuario.use-case';
import { ListarUsuariosUseCase } from '../application/listar-usuarios.use-case';
import { ObtenerUsuarioUseCase } from '../application/obtener-usuario.use-case';
import { OtorgarPermisoIndividualUseCase } from '../application/otorgar-permiso-individual.use-case';
import { QuitarRolUseCase } from '../application/quitar-rol.use-case';
import { RevocarPermisoIndividualUseCase } from '../application/revocar-permiso-individual.use-case';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UsuarioAutenticado } from './auth/jwt-payload.interface';
import { PermisosGuard } from './auth/permisos.guard';
import { RequierePermiso } from './auth/requiere-permiso.decorator';
import { AsignarRolDto } from './dto/asignar-rol.dto';
import { CambiarPasswordDto } from './dto/cambiar-password.dto';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { EditarUsuarioDto } from './dto/editar-usuario.dto';
import { ListarUsuariosQueryDto } from './dto/listar-usuarios-query.dto';
import { OtorgarPermisoDto } from './dto/otorgar-permiso.dto';

const SALT_ROUNDS = 10;

interface RequestConUsuario extends Request {
  user: UsuarioAutenticado;
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsuariosController {
  constructor(
    private readonly crearUsuarioUseCase: CrearUsuarioUseCase,
    private readonly listarUsuariosUseCase: ListarUsuariosUseCase,
    private readonly obtenerUsuarioUseCase: ObtenerUsuarioUseCase,
    private readonly desactivarUsuarioUseCase: DesactivarUsuarioUseCase,
    private readonly activarUsuarioUseCase: ActivarUsuarioUseCase,
    private readonly editarUsuarioUseCase: EditarUsuarioUseCase,
    private readonly cambiarPasswordUseCase: CambiarPasswordUseCase,
    private readonly asignarRolUseCase: AsignarRolUseCase,
    private readonly quitarRolUseCase: QuitarRolUseCase,
    private readonly otorgarPermisoIndividualUseCase: OtorgarPermisoIndividualUseCase,
    private readonly revocarPermisoIndividualUseCase: RevocarPermisoIndividualUseCase,
    @Inject('UsuarioRolRepository') private readonly usuarioRolRepository: UsuarioRolRepository,
  ) {}

  @Get()
  @UseGuards(PermisosGuard)
  @RequierePermiso('usuarios.listar')
  async listar(@Query() query: ListarUsuariosQueryDto) {
    const { usuarios, total, page, limit } = await this.listarUsuariosUseCase.ejecutar(query);
    const usuariosConRoles = await Promise.all(
      usuarios.map(async (usuario) => {
        const roles = await this.usuarioRolRepository.listarNombresRolesPorUsuario(usuario.id);
        return this.aRespuesta(usuario, roles);
      }),
    );
    return { usuarios: usuariosConRoles, total, page, limit };
  }

  @Post()
  @UseGuards(PermisosGuard)
  @RequierePermiso('usuarios.crear')
  async crear(@Body() dto: CrearUsuarioDto) {
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const usuario = await this.crearUsuarioUseCase.ejecutar({
      nombre: dto.nombre,
      usuario: dto.usuario,
      passwordHash,
    });
    return this.aRespuesta(usuario);
  }

  @Get(':id')
  async obtener(@Param('id') id: string) {
    const usuario = await this.obtenerUsuarioUseCase.ejecutar(id);
    const roles = await this.usuarioRolRepository.listarNombresRolesPorUsuario(id);
    return this.aRespuesta(usuario, roles);
  }

  @Patch(':id')
  @UseGuards(PermisosGuard)
  @RequierePermiso('usuarios.editar')
  async editar(@Param('id') id: string, @Body() dto: EditarUsuarioDto) {
    const usuario = await this.editarUsuarioUseCase.ejecutar({
      usuarioId: id,
      nombre: dto.nombre,
      usuario: dto.usuario,
    });
    return this.aRespuesta(usuario);
  }

  @Patch(':id/deactivate')
  @UseGuards(PermisosGuard)
  @RequierePermiso('usuarios.desactivar')
  async desactivar(@Param('id') id: string) {
    const usuario = await this.desactivarUsuarioUseCase.ejecutar(id);
    return this.aRespuesta(usuario);
  }

  @Patch(':id/activate')
  @UseGuards(PermisosGuard)
  @RequierePermiso('usuarios.desactivar')
  async activar(@Param('id') id: string) {
    const usuario = await this.activarUsuarioUseCase.ejecutar(id);
    return this.aRespuesta(usuario);
  }

  @Patch(':id/password')
  @UseGuards(PermisosGuard)
  @RequierePermiso('usuarios.editar')
  async cambiarPassword(@Param('id') id: string, @Body() dto: CambiarPasswordDto) {
    const usuario = await this.cambiarPasswordUseCase.ejecutar({
      usuarioId: id,
      nuevoPassword: dto.nuevoPassword,
    });
    return this.aRespuesta(usuario);
  }

  @Patch(':id/roles')
  @UseGuards(PermisosGuard)
  @RequierePermiso('usuarios.asignar_rol')
  asignarRol(@Param('id') id: string, @Body() dto: AsignarRolDto) {
    return this.asignarRolUseCase.ejecutar({ usuarioId: id, rolId: dto.rolId });
  }

  @Delete(':id/roles/:rolId')
  @UseGuards(PermisosGuard)
  @RequierePermiso('usuarios.asignar_rol')
  quitarRol(@Param('id') id: string, @Param('rolId') rolId: string) {
    return this.quitarRolUseCase.ejecutar({ usuarioId: id, rolId });
  }

  @Post(':id/permissions')
  @UseGuards(PermisosGuard)
  @RequierePermiso('usuarios.otorgar_permiso')
  otorgarPermiso(
    @Param('id') id: string,
    @Body() dto: OtorgarPermisoDto,
    @Req() req: RequestConUsuario,
  ) {
    return this.otorgarPermisoIndividualUseCase.ejecutar({
      usuarioId: id,
      permisoId: dto.permisoId,
      otorgadoPorUsuarioId: req.user.sub,
    });
  }

  @Delete(':id/permissions/:permissionId')
  @UseGuards(PermisosGuard)
  @RequierePermiso('usuarios.otorgar_permiso')
  revocarPermiso(@Param('id') id: string, @Param('permissionId') permissionId: string) {
    return this.revocarPermisoIndividualUseCase.ejecutar({
      usuarioId: id,
      permisoId: permissionId,
    });
  }

  private aRespuesta(usuario: Usuario, roles?: string[]) {
    return {
      id: usuario.id,
      nombre: usuario.nombre,
      usuario: usuario.usuario,
      activo: usuario.activo,
      fechaUltimoAcceso: usuario.fechaUltimoAcceso,
      ...(roles ? { roles } : {}),
    };
  }
}
