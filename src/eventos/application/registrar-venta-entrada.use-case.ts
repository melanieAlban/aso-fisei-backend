import { ConflictError, NotFoundError } from '../../shared/domain/errors';
import { AsignacionEntradasRepository } from '../domain/asignacion-entradas.repository';
import { EventoRepository } from '../domain/evento.repository';
import { TipoEntradaRepository } from '../domain/tipo-entrada.repository';
import { MetodoPagoVentaEntrada, VentaEntrada } from '../domain/venta-entrada.entity';
import { VentaEntradaRepository } from '../domain/venta-entrada.repository';

function redondear(valor: number): number {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

export class RegistrarVentaEntradaUseCase {
  constructor(
    private readonly ventaRepository: VentaEntradaRepository,
    private readonly tipoEntradaRepository: TipoEntradaRepository,
    private readonly asignacionRepository: AsignacionEntradasRepository,
    private readonly eventoRepository: EventoRepository,
  ) {}

  async ejecutar(datos: {
    tipoEntradaId: string;
    usuarioId: string;
    cantidad: number;
    esCombo: boolean;
    metodoPago: MetodoPagoVentaEntrada;
  }): Promise<VentaEntrada> {
    const tipoEntrada = await this.tipoEntradaRepository.buscarPorId(datos.tipoEntradaId);

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

    if (datos.esCombo && (!tipoEntrada.precioCombo || !tipoEntrada.cantidadCombo)) {
      throw new ConflictError('Este tipo de entrada no tiene precio de combo configurado');
    }

    const cantidadEntradas = datos.esCombo ? datos.cantidad * tipoEntrada.cantidadCombo! : datos.cantidad;
    const cantidadCombo = datos.esCombo ? cantidadEntradas : 0;
    const monto = redondear(
      datos.esCombo ? datos.cantidad * tipoEntrada.precioCombo! : datos.cantidad * tipoEntrada.precio,
    );

    const [asignaciones, ventas] = await Promise.all([
      this.asignacionRepository.listarPorEvento(evento.id),
      this.ventaRepository.listarPorEvento(evento.id),
    ]);

    const asignadoNeto = asignaciones
      .filter((a) => a.tipoEntradaId === tipoEntrada.id)
      .reduce((acc, a) => acc + a.cantidadAsignada - a.cantidadDevuelta, 0);
    const vendidoDirecto = ventas
      .filter((v) => v.tipoEntradaId === tipoEntrada.id)
      .reduce((acc, v) => acc + v.cantidad, 0);
    const disponible = tipoEntrada.cantidadTotal - asignadoNeto - vendidoDirecto;

    if (cantidadEntradas > disponible) {
      throw new ConflictError(`Solo quedan ${disponible} entrada(s) disponible(s) de este tipo`);
    }

    const venta = new VentaEntrada(
      crypto.randomUUID(),
      tipoEntrada.id,
      datos.usuarioId,
      cantidadEntradas,
      cantidadCombo,
      monto,
      datos.metodoPago,
      new Date(),
    );

    return this.ventaRepository.crear(venta);
  }
}
