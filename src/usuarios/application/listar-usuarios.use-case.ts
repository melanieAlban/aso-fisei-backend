import { Usuario } from '../domain/usuario.entity';
import { UsuarioRepository } from '../domain/usuario.repository';

export class ListarUsuariosUseCase {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async ejecutar(datos: {
    page?: number;
    limit?: number;
  }): Promise<{ usuarios: Usuario[]; total: number; page: number; limit: number }> {
    const page = datos.page && datos.page > 0 ? datos.page : 1;
    const limit = datos.limit && datos.limit > 0 ? datos.limit : 20;

    const { usuarios, total } = await this.usuarioRepository.listarTodos(page, limit);

    return { usuarios, total, page, limit };
  }
}
