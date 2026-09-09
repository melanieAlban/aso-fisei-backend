import { NotFoundError } from '../../shared/domain/errors';
import { AsignacionEntradasRepository } from '../domain/asignacion-entradas.repository';
import { Evento } from '../domain/evento.entity';
import { EventoRepository } from '../domain/evento.repository';
import { GastoEventoRepository } from '../domain/gasto-evento.repository';
import { IngresoEventoRepository } from '../domain/ingreso-evento.repository';
import { VentaEntradaRepository } from '../domain/venta-entrada.repository';

export interface ResumenEvento {
  evento: Evento;
  ingresosManuales: number;
  ingresosAsignaciones: number;
  ingresosVentaDirecta: number;
  ingresosEntradas: number;
  totalIngresos: number;
  totalGastos: number;
  utilidad: number;
}

export class ObtenerResumenEventoUseCase {
  constructor(
    private readonly eventoRepository: EventoRepository,
    private readonly ingresoRepository: IngresoEventoRepository,
    private readonly gastoRepository: GastoEventoRepository,
    private readonly asignacionRepository: AsignacionEntradasRepository,
    private readonly ventaEntradaRepository: VentaEntradaRepository,
  ) {}

  async ejecutar(eventoId: string): Promise<ResumenEvento> {
    const evento = await this.eventoRepository.buscarPorId(eventoId);

    if (!evento) {
      throw new NotFoundError('Evento no encontrado');
    }

    const [ingresos, gastos, asignaciones, ventasEntrada] = await Promise.all([
      this.ingresoRepository.listarPorEvento(eventoId),
      this.gastoRepository.listarPorEvento(eventoId),
      this.asignacionRepository.listarPorEvento(eventoId),
      this.ventaEntradaRepository.listarPorEvento(eventoId),
    ]);

    const ingresosManuales = ingresos.reduce((acc, ingreso) => acc + ingreso.monto, 0);
    const ingresosAsignaciones = asignaciones.reduce(
      (acc, asignacion) => acc + asignacion.dineroRecibido,
      0,
    );
    const ingresosVentaDirecta = ventasEntrada.reduce((acc, venta) => acc + venta.monto, 0);
    const ingresosEntradas = ingresosAsignaciones + ingresosVentaDirecta;
    const totalIngresos = ingresosManuales + ingresosEntradas;
    const totalGastos = gastos.reduce((acc, gasto) => acc + gasto.monto, 0);

    return {
      evento,
      ingresosManuales,
      ingresosAsignaciones,
      ingresosVentaDirecta,
      ingresosEntradas,
      totalIngresos,
      totalGastos,
      utilidad: totalIngresos - totalGastos,
    };
  }
}
