import { DetalleVenta } from '../domain/detalle-venta.entity';
import { VentaRepository } from '../domain/venta.repository';

export class DevolverAlquilerUseCase {
  constructor(private readonly ventaRepository: VentaRepository) {}

  async ejecutar(itemId: string): Promise<DetalleVenta> {
    const detalle = await this.ventaRepository.buscarDetallePorId(itemId);

    if (!detalle) {
      throw new Error('Ítem no encontrado');
    }
    if (!detalle.esAlquiler) {
      throw new Error('El ítem no corresponde a un alquiler');
    }
    if (detalle.estadoAlquiler === 'DEVUELTO') {
      throw new Error('El alquiler ya fue devuelto');
    }

    return this.ventaRepository.marcarAlquilerDevuelto(itemId);
  }
}
