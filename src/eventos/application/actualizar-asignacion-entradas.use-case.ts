import { ConflictError, NotFoundError } from '../../shared/domain/errors';
import { AsignacionEntradas, MetodoPagoAsignacion } from '../domain/asignacion-entradas.entity';
import { AsignacionEntradasRepository } from '../domain/asignacion-entradas.repository';
import { EventoRepository } from '../domain/evento.repository';
import { TipoEntradaRepository } from '../domain/tipo-entrada.repository';

export class ActualizarAsignacionEntradasUseCase {
  constructor(
    private readonly asignacionRepository: AsignacionEntradasRepository,
    private readonly tipoEntradaRepository: TipoEntradaRepository,
    private readonly eventoRepository: EventoRepository,
  ) {}

  async ejecutar(datos: {
    id: string;
    cantidadVendida?: number;
    cantidadDevuelta?: number;
    dineroRecibido?: number;
    metodoPago?: MetodoPagoAsignacion;
  }): Promise<AsignacionEntradas> {
    const actual = await this.asignacionRepository.buscarPorId(datos.id);

    if (!actual) {
      throw new NotFoundError('Asignación no encontrada');
    }

    const tipoEntrada = await this.tipoEntradaRepository.buscarPorId(actual.tipoEntradaId);

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

    const actualizada = new AsignacionEntradas(
      actual.id,
      actual.tipoEntradaId,
      actual.usuarioRegistroId,
      actual.nombreReferencia,
      actual.cantidadAsignada,
      datos.cantidadVendida ?? actual.cantidadVendida,
      datos.cantidadDevuelta ?? actual.cantidadDevuelta,
      datos.dineroRecibido ?? actual.dineroRecibido,
      datos.metodoPago ?? actual.metodoPago,
      actual.fecha,
    );

    return this.asignacionRepository.actualizar(actualizada);
  }
}
