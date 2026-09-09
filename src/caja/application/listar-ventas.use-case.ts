import { UsuarioRepository } from '../../usuarios/domain/usuario.repository';
import { VentaConDetalle, VentaRepository } from '../domain/venta.repository';

export interface VentaConDetalleYVendedor extends VentaConDetalle {
  vendedorNombre: string;
}

export class ListarVentasUseCase {
  constructor(
    private readonly ventaRepository: VentaRepository,
    private readonly usuarioRepository: UsuarioRepository,
  ) {}

  async ejecutar(datos: {
    desde?: Date;
    hasta?: Date;
    page?: number;
    limit?: number;
  }): Promise<{ ventas: VentaConDetalleYVendedor[]; total: number; page: number; limit: number }> {
    const page = datos.page && datos.page > 0 ? datos.page : 1;
    const limit = datos.limit && datos.limit > 0 ? datos.limit : 20;

    const { ventas, total } = await this.ventaRepository.listarTodos(
      { desde: datos.desde, hasta: datos.hasta },
      page,
      limit,
    );

    const idsUnicos = [...new Set(ventas.map((v) => v.venta.usuarioId))];
    const usuarios = await Promise.all(idsUnicos.map((id) => this.usuarioRepository.buscarPorId(id)));
    const nombrePorId = new Map(idsUnicos.map((id, i) => [id, usuarios[i]?.nombre ?? 'Usuario eliminado']));

    const ventasConVendedor = ventas.map((v) => ({
      ...v,
      vendedorNombre: nombrePorId.get(v.venta.usuarioId) ?? 'Usuario eliminado',
    }));

    return { ventas: ventasConVendedor, total, page, limit };
  }
}
