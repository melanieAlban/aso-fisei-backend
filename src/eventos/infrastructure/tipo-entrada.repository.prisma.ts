import { Injectable } from '@nestjs/common';
import { TipoEntrada as TipoEntradaPrisma } from '@prisma/client';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import { TipoEntrada } from '../domain/tipo-entrada.entity';
import { TipoEntradaRepository } from '../domain/tipo-entrada.repository';

@Injectable()
export class TipoEntradaRepositoryPrisma implements TipoEntradaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(tipoEntrada: TipoEntrada): Promise<TipoEntrada> {
    const creado = await this.prisma.tipoEntrada.create({
      data: {
        id: tipoEntrada.id,
        eventoId: tipoEntrada.eventoId,
        nombre: tipoEntrada.nombre,
        precio: tipoEntrada.precio,
        cantidadTotal: tipoEntrada.cantidadTotal,
        precioCombo: tipoEntrada.precioCombo,
        cantidadCombo: tipoEntrada.cantidadCombo,
      },
    });

    return this.aDominio(creado);
  }

  async guardar(tipoEntrada: TipoEntrada): Promise<TipoEntrada> {
    const actualizado = await this.prisma.tipoEntrada.update({
      where: { id: tipoEntrada.id },
      data: {
        nombre: tipoEntrada.nombre,
        precio: tipoEntrada.precio,
        cantidadTotal: tipoEntrada.cantidadTotal,
        precioCombo: tipoEntrada.precioCombo,
        cantidadCombo: tipoEntrada.cantidadCombo,
      },
    });

    return this.aDominio(actualizado);
  }

  async eliminar(id: string): Promise<void> {
    await this.prisma.tipoEntrada.delete({ where: { id } });
  }

  async buscarPorId(id: string): Promise<TipoEntrada | null> {
    const encontrado = await this.prisma.tipoEntrada.findUnique({ where: { id } });
    return encontrado ? this.aDominio(encontrado) : null;
  }

  async listarPorEvento(eventoId: string): Promise<TipoEntrada[]> {
    const registros = await this.prisma.tipoEntrada.findMany({ where: { eventoId } });
    return registros.map((registro) => this.aDominio(registro));
  }

  private aDominio(registro: TipoEntradaPrisma): TipoEntrada {
    return new TipoEntrada(
      registro.id,
      registro.eventoId,
      registro.nombre,
      registro.precio.toNumber(),
      registro.cantidadTotal,
      registro.precioCombo ? registro.precioCombo.toNumber() : null,
      registro.cantidadCombo,
    );
  }
}
