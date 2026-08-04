import { Deuda } from '../domain/deuda.entity';
import { DeudaRepository } from '../domain/deuda.repository';

export class CrearDeudaUseCase {
  constructor(private readonly deudaRepository: DeudaRepository) {}

  ejecutar(datos: {
    usuarioId: string;
    gastoId?: string;
    tipo: 'POR_COBRAR' | 'POR_PAGAR';
    contraparte: string;
    montoTotal: number;
  }): Promise<Deuda> {
    const nuevaDeuda = new Deuda(
      crypto.randomUUID(),
      datos.usuarioId,
      datos.gastoId ?? null,
      datos.tipo,
      datos.contraparte,
      datos.montoTotal,
      0,
      'PENDIENTE',
      new Date(),
    );

    return this.deudaRepository.crear(nuevaDeuda);
  }
}
