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
    nombreReferencia?: string;
    telefono?: string | null;
    semestre?: string | null;
    carrera?: string | null;
    cantidadAsignada?: number;
    cantidadVendida?: number;
    cantidadVendidaCombo?: number;
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
      datos.nombreReferencia ?? actual.nombreReferencia,
      datos.cantidadAsignada ?? actual.cantidadAsignada,
      datos.cantidadVendida ?? actual.cantidadVendida,
      datos.cantidadDevuelta ?? actual.cantidadDevuelta,
      datos.dineroRecibido ?? actual.dineroRecibido,
      datos.metodoPago ?? actual.metodoPago,
      actual.fecha,
      datos.cantidadVendidaCombo ?? actual.cantidadVendidaCombo,
      datos.telefono !== undefined ? datos.telefono : actual.telefono,
      datos.semestre !== undefined ? datos.semestre : actual.semestre,
      datos.carrera !== undefined ? datos.carrera : actual.carrera,
    );

    return this.asignacionRepository.actualizar(actualizada);
  }
}
