import { ConflictError, NotFoundError } from '../../shared/domain/errors';
import { EventoRepository } from '../domain/evento.repository';
import { TipoEntrada } from '../domain/tipo-entrada.entity';
import { TipoEntradaRepository } from '../domain/tipo-entrada.repository';

export class EditarTipoEntradaUseCase {
  constructor(
    private readonly tipoEntradaRepository: TipoEntradaRepository,
    private readonly eventoRepository: EventoRepository,
  ) {}

  async ejecutar(datos: {
    id: string;
    nombre?: string;
    precio?: number;
    cantidadTotal?: number;
    precioCombo?: number | null;
    cantidadCombo?: number | null;
  }): Promise<TipoEntrada> {
    const actual = await this.tipoEntradaRepository.buscarPorId(datos.id);

    if (!actual) {
      throw new NotFoundError('Tipo de entrada no encontrado');
    }

    const evento = await this.eventoRepository.buscarPorId(actual.eventoId);

    if (!evento) {
      throw new NotFoundError('Evento no encontrado');
    }
    if (evento.estado !== 'ACTIVO') {
      throw new ConflictError('El evento no está activo');
    }

    const actualizado = new TipoEntrada(
      actual.id,
      actual.eventoId,
      datos.nombre ?? actual.nombre,
      datos.precio ?? actual.precio,
      datos.cantidadTotal ?? actual.cantidadTotal,
      datos.precioCombo !== undefined ? datos.precioCombo : actual.precioCombo,
      datos.cantidadCombo !== undefined ? datos.cantidadCombo : actual.cantidadCombo,
    );

    return this.tipoEntradaRepository.guardar(actualizado);
  }
}
