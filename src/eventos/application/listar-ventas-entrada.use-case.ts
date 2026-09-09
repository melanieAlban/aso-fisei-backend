import { UsuarioRepository } from '../../usuarios/domain/usuario.repository';
import { MetodoPagoVentaEntrada } from '../domain/venta-entrada.entity';
import { VentaEntradaRepository } from '../domain/venta-entrada.repository';

export interface VentaEntradaConVendedor {
  id: string;
  tipoEntradaId: string;
  usuarioId: string;
  vendedorNombre: string;
  cantidad: number;
  cantidadCombo: number;
  monto: number;
  metodoPago: MetodoPagoVentaEntrada;
  fecha: Date;
}

export class ListarVentasEntradaUseCase {
  constructor(
    private readonly ventaRepository: VentaEntradaRepository,
    private readonly usuarioRepository: UsuarioRepository,
  ) {}

  async ejecutar(eventoId: string): Promise<VentaEntradaConVendedor[]> {
    const ventas = await this.ventaRepository.listarPorEvento(eventoId);

    const idsUnicos = [...new Set(ventas.map((v) => v.usuarioId))];
    const usuarios = await Promise.all(idsUnicos.map((id) => this.usuarioRepository.buscarPorId(id)));
    const nombrePorId = new Map(idsUnicos.map((id, i) => [id, usuarios[i]?.nombre ?? 'Usuario eliminado']));

    return ventas.map((venta) => ({
      id: venta.id,
      tipoEntradaId: venta.tipoEntradaId,
      usuarioId: venta.usuarioId,
      vendedorNombre: nombrePorId.get(venta.usuarioId) ?? 'Usuario eliminado',
      cantidad: venta.cantidad,
      cantidadCombo: venta.cantidadCombo,
      monto: venta.monto,
      metodoPago: venta.metodoPago,
      fecha: venta.fecha,
    }));
  }
}
