import { ConflictError, NotFoundError } from '../../shared/domain/errors';
import { AsignacionEntradas } from '../domain/asignacion-entradas.entity';
import { AsignacionEntradasRepository } from '../domain/asignacion-entradas.repository';
import { EventoRepository } from '../domain/evento.repository';
import { TipoEntradaRepository } from '../domain/tipo-entrada.repository';

export class CrearAsignacionEntradasUseCase {
  constructor(
    private readonly asignacionRepository: AsignacionEntradasRepository,
    private readonly tipoEntradaRepository: TipoEntradaRepository,
    private readonly eventoRepository: EventoRepository,
  ) {}

  async ejecutar(datos: {
    tipoEntradaId: string;
    usuarioRegistroId: string;
    nombreReferencia: string;
    cantidadAsignada: number;
  }): Promise<AsignacionEntradas> {
    const tipoEntrada = await this.tipoEntradaRepository.buscarPorId(datos.tipoEntradaId);

    if (!tipoEntrada) {
      throw new NotFoundError('Tipo de entrada no encontrado');
    }

    const evento = await this.eventoRepository.buscarPorId(tipoEntrada.eventoId);

    if (!evento) {
      throw new NotFoundError('Evento no encontrado');
    }
    if (evento.estado === 'CERRADO') {
      throw new ConflictError('El evento ya está cerrado');
    }

    const asignacion = new AsignacionEntradas(
      crypto.randomUUID(),
      datos.tipoEntradaId,
      datos.usuarioRegistroId,
      datos.nombreReferencia,
      datos.cantidadAsignada,
      0,
      0,
      0,
      null,
      new Date(),
    );

    return this.asignacionRepository.crear(asignacion);
  }
}
