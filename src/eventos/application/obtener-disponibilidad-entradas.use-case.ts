import { AsignacionEntradasRepository } from '../domain/asignacion-entradas.repository';
import { TipoEntrada } from '../domain/tipo-entrada.entity';
import { TipoEntradaRepository } from '../domain/tipo-entrada.repository';
import { VentaEntradaRepository } from '../domain/venta-entrada.repository';

export interface DisponibilidadTipoEntrada {
  tipoEntrada: TipoEntrada;
  cantidadDisponible: number;
}

export class ObtenerDisponibilidadEntradasUseCase {
  constructor(
    private readonly tipoEntradaRepository: TipoEntradaRepository,
    private readonly asignacionRepository: AsignacionEntradasRepository,
    private readonly ventaRepository: VentaEntradaRepository,
  ) {}

  async ejecutar(eventoId: string): Promise<DisponibilidadTipoEntrada[]> {
    const [tipos, asignaciones, ventas] = await Promise.all([
      this.tipoEntradaRepository.listarPorEvento(eventoId),
      this.asignacionRepository.listarPorEvento(eventoId),
      this.ventaRepository.listarPorEvento(eventoId),
    ]);

    return tipos.map((tipoEntrada) => {
      const asignadoNeto = asignaciones
        .filter((a) => a.tipoEntradaId === tipoEntrada.id)
        .reduce((acc, a) => acc + a.cantidadAsignada - a.cantidadDevuelta, 0);
      const vendidoDirecto = ventas
        .filter((v) => v.tipoEntradaId === tipoEntrada.id)
        .reduce((acc, v) => acc + v.cantidad, 0);

      return {
        tipoEntrada,
        cantidadDisponible: tipoEntrada.cantidadTotal - asignadoNeto - vendidoDirecto,
      };
    });
  }
}
