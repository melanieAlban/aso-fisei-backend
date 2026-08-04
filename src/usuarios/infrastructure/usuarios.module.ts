import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AsignarRolUseCase } from '../application/asignar-rol.use-case';
import { CambiarPasswordUseCase } from '../application/cambiar-password.use-case';
import { CrearUsuarioUseCase } from '../application/crear-usuario.use-case';
import { DesactivarUsuarioUseCase } from '../application/desactivar-usuario.use-case';
import { ListarPermisosUseCase } from '../application/listar-permisos.use-case';
import { ListarRolesUseCase } from '../application/listar-roles.use-case';
import { ListarUsuariosUseCase } from '../application/listar-usuarios.use-case';
import { LoginUseCase } from '../application/login.use-case';
import { ObtenerUsuarioUseCase } from '../application/obtener-usuario.use-case';
import { OtorgarPermisoIndividualUseCase } from '../application/otorgar-permiso-individual.use-case';
import { TokenService } from '../application/ports/token.service';
import { RefrescarTokenUseCase } from '../application/refrescar-token.use-case';
import { RevocarPermisoIndividualUseCase } from '../application/revocar-permiso-individual.use-case';
import { PermisoRepository } from '../domain/permiso.repository';
import { RolRepository } from '../domain/rol.repository';
import { UsuarioPermisoExtraRepository } from '../domain/usuario-permiso-extra.repository';
import { UsuarioRolRepository } from '../domain/usuario-rol.repository';
import { UsuarioRepository } from '../domain/usuario.repository';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { JwtStrategy } from './auth/jwt.strategy';
import { JwtTokenService } from './auth/jwt-token.service';
import { PermisosGuard } from './auth/permisos.guard';
import { PermisoRepositoryPrisma } from './permiso.repository.prisma';
import { PermisosController } from './permisos.controller';
import { PermisosUsuarioRepositoryPrisma } from './permisos-usuario.repository.prisma';
import { RolRepositoryPrisma } from './rol.repository.prisma';
import { RolesController } from './roles.controller';
import { UsuarioPermisoExtraRepositoryPrisma } from './usuario-permiso-extra.repository.prisma';
import { UsuarioRolRepositoryPrisma } from './usuario-rol.repository.prisma';
import { UsuarioRepositoryPrisma } from './usuario.repository.prisma';
import { UsuariosController } from './usuarios.controller';

@Module({
  imports: [PassportModule, JwtModule.register({})],
  controllers: [AuthController, UsuariosController, RolesController, PermisosController],
  providers: [
    { provide: 'UsuarioRepository', useClass: UsuarioRepositoryPrisma },
    { provide: 'RolRepository', useClass: RolRepositoryPrisma },
    { provide: 'PermisoRepository', useClass: PermisoRepositoryPrisma },
    { provide: 'UsuarioRolRepository', useClass: UsuarioRolRepositoryPrisma },
    { provide: 'UsuarioPermisoExtraRepository', useClass: UsuarioPermisoExtraRepositoryPrisma },
    { provide: 'PermisosUsuarioRepository', useClass: PermisosUsuarioRepositoryPrisma },
    { provide: 'TokenService', useClass: JwtTokenService },
    JwtStrategy,
    JwtAuthGuard,
    PermisosGuard,
    {
      provide: CrearUsuarioUseCase,
      useFactory: (repo: UsuarioRepository) => new CrearUsuarioUseCase(repo),
      inject: ['UsuarioRepository'],
    },
    {
      provide: LoginUseCase,
      useFactory: (repo: UsuarioRepository, tokenService: TokenService) =>
        new LoginUseCase(repo, tokenService),
      inject: ['UsuarioRepository', 'TokenService'],
    },
    {
      provide: RefrescarTokenUseCase,
      useFactory: (tokenService: TokenService) => new RefrescarTokenUseCase(tokenService),
      inject: ['TokenService'],
    },
    {
      provide: AsignarRolUseCase,
      useFactory: (repo: UsuarioRolRepository) => new AsignarRolUseCase(repo),
      inject: ['UsuarioRolRepository'],
    },
    {
      provide: OtorgarPermisoIndividualUseCase,
      useFactory: (repo: UsuarioPermisoExtraRepository) =>
        new OtorgarPermisoIndividualUseCase(repo),
      inject: ['UsuarioPermisoExtraRepository'],
    },
    {
      provide: RevocarPermisoIndividualUseCase,
      useFactory: (repo: UsuarioPermisoExtraRepository) =>
        new RevocarPermisoIndividualUseCase(repo),
      inject: ['UsuarioPermisoExtraRepository'],
    },
    {
      provide: DesactivarUsuarioUseCase,
      useFactory: (repo: UsuarioRepository) => new DesactivarUsuarioUseCase(repo),
      inject: ['UsuarioRepository'],
    },
    {
      provide: CambiarPasswordUseCase,
      useFactory: (repo: UsuarioRepository) => new CambiarPasswordUseCase(repo),
      inject: ['UsuarioRepository'],
    },
    {
      provide: ListarUsuariosUseCase,
      useFactory: (repo: UsuarioRepository) => new ListarUsuariosUseCase(repo),
      inject: ['UsuarioRepository'],
    },
    {
      provide: ObtenerUsuarioUseCase,
      useFactory: (repo: UsuarioRepository) => new ObtenerUsuarioUseCase(repo),
      inject: ['UsuarioRepository'],
    },
    {
      provide: ListarRolesUseCase,
      useFactory: (repo: RolRepository) => new ListarRolesUseCase(repo),
      inject: ['RolRepository'],
    },
    {
      provide: ListarPermisosUseCase,
      useFactory: (repo: PermisoRepository) => new ListarPermisosUseCase(repo),
      inject: ['PermisoRepository'],
    },
  ],
})
export class UsuariosModule {}
