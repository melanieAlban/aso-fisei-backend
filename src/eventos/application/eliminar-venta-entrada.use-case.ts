import { ConflictError, NotFoundError } from '../../shared/domain/errors';
import { EventoRepository } from '../domain/evento.repository';
import { TipoEntradaRepository } from '../domain/tipo-entrada.repository';
import { VentaEntradaRepository } from '../domain/venta-entrada.repository';

export class EliminarVentaEntradaUseCase {
  constructor(
    private readonly ventaRepository: VentaEntradaRepository,
    private readonly tipoEntradaRepository: TipoEntradaRepository,
    private readonly eventoRepository: EventoRepository,
  ) {}

  async ejecutar(id: string): Promise<void> {
    const venta = await this.ventaRepository.buscarPorId(id);

    if (!venta) {
      throw new NotFoundError('Venta de entrada no encontrada');
    }

    const tipoEntrada = await this.tipoEntradaRepository.buscarPorId(venta.tipoEntradaId);

    if (!tipoEntrada) {
      throw new NotFoundError('Tipo de entrada no encontrado');
    }

    const evento = await this.eventoRepository.buscarPorId(tipoEntrada.eventoId);

    if (!evento) {
      throw new NotFoundError('Evento no encontrado');
    }
    if (evento.estado !== 'ACTIVO') {
      throw new ConflictError('El evento no está activo');
    }

    await this.ventaRepository.eliminar(id);
  }
}
