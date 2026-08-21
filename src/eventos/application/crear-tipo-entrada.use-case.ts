import { ConflictError, NotFoundError } from '../../shared/domain/errors';
import { EventoRepository } from '../domain/evento.repository';
import { TipoEntrada } from '../domain/tipo-entrada.entity';
import { TipoEntradaRepository } from '../domain/tipo-entrada.repository';

export class CrearTipoEntradaUseCase {
  constructor(
    private readonly tipoEntradaRepository: TipoEntradaRepository,
    private readonly eventoRepository: EventoRepository,
  ) {}

  async ejecutar(datos: {
    eventoId: string;
    nombre: string;
    precio: number;
    cantidadTotal: number;
  }): Promise<TipoEntrada> {
    const evento = await this.eventoRepository.buscarPorId(datos.eventoId);

    if (!evento) {
      throw new NotFoundError('Evento no encontrado');
    }
    if (evento.estado === 'CERRADO') {
      throw new ConflictError('El evento ya está cerrado');
    }

    const tipoEntrada = new TipoEntrada(
      crypto.randomUUID(),
      datos.eventoId,
      datos.nombre,
      datos.precio,
      datos.cantidadTotal,
    );

    return this.tipoEntradaRepository.crear(tipoEntrada);
  }
}
