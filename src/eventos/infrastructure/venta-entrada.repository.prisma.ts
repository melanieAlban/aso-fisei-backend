import { Injectable } from '@nestjs/common';
import { VentaEntrada as VentaEntradaPrisma } from '@prisma/client';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import { VentaEntrada } from '../domain/venta-entrada.entity';
import { VentaEntradaRepository } from '../domain/venta-entrada.repository';

@Injectable()
export class VentaEntradaRepositoryPrisma implements VentaEntradaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(venta: VentaEntrada): Promise<VentaEntrada> {
    const creado = await this.prisma.ventaEntrada.create({
      data: {
        id: venta.id,
        tipoEntradaId: venta.tipoEntradaId,
        usuarioId: venta.usuarioId,
        cantidad: venta.cantidad,
        cantidadCombo: venta.cantidadCombo,
        monto: venta.monto,
        metodoPago: venta.metodoPago,
        fecha: venta.fecha,
      },
    });

    return this.aDominio(creado);
  }

  async eliminar(id: string): Promise<void> {
    await this.prisma.ventaEntrada.delete({ where: { id } });
  }

  async buscarPorId(id: string): Promise<VentaEntrada | null> {
    const encontrado = await this.prisma.ventaEntrada.findUnique({ where: { id } });
    return encontrado ? this.aDominio(encontrado) : null;
  }

  async listarPorEvento(eventoId: string): Promise<VentaEntrada[]> {
    const registros = await this.prisma.ventaEntrada.findMany({
      where: { tipoEntrada: { eventoId } },
      orderBy: { fecha: 'desc' },
    });

    return registros.map((registro) => this.aDominio(registro));
  }

  private aDominio(registro: VentaEntradaPrisma): VentaEntrada {
    return new VentaEntrada(
      registro.id,
      registro.tipoEntradaId,
      registro.usuarioId,
      registro.cantidad,
      registro.cantidadCombo,
      registro.monto.toNumber(),
      registro.metodoPago,
      registro.fecha,
    );
  }
}
