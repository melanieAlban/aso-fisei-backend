import { VentaConDetalle, VentaRepository } from '../domain/venta.repository';

export class ObtenerVentaUseCase {
  constructor(private readonly ventaRepository: VentaRepository) {}

  async ejecutar(id: string): Promise<VentaConDetalle> {
    const venta = await this.ventaRepository.buscarPorId(id);

    if (!venta) {
      throw new Error('Venta no encontrada');
    }

    return venta;
  }
}
