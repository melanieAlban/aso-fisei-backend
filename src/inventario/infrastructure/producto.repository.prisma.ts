import { Injectable } from '@nestjs/common';
import { Producto as ProductoPrisma } from '@prisma/client';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import { Producto } from '../domain/producto.entity';
import { ProductoRepository } from '../domain/producto.repository';

@Injectable()
export class ProductoRepositoryPrisma implements ProductoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(producto: Producto): Promise<Producto> {
    const creado = await this.prisma.producto.create({
      data: {
        id: producto.id,
        nombre: producto.nombre,
        costoUnitario: producto.costoUnitario,
        precioVenta: producto.precioVenta,
        stockActual: producto.stockActual,
        activo: producto.activo,
        cobraPorTiempo: producto.cobraPorTiempo,
        tarifaPorHora: producto.tarifaPorHora,
      },
    });

    return this.aDominio(creado);
  }

  async buscarPorId(id: string): Promise<Producto | null> {
    const encontrado = await this.prisma.producto.findUnique({ where: { id } });
    return encontrado ? this.aDominio(encontrado) : null;
  }

  async listarTodos(page: number, limit: number): Promise<{ productos: Producto[]; total: number }> {
    const [registros, total] = await this.prisma.$transaction([
      this.prisma.producto.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { nombre: 'asc' },
      }),
      this.prisma.producto.count(),
    ]);

    return { productos: registros.map((registro) => this.aDominio(registro)), total };
  }

  async listarConPocoStock(umbral: number): Promise<Producto[]> {
    const registros = await this.prisma.producto.findMany({
      where: { activo: true, stockActual: { lte: umbral } },
      orderBy: { stockActual: 'asc' },
    });

    return registros.map((registro) => this.aDominio(registro));
  }

  async actualizarStock(id: string, nuevoStock: number): Promise<Producto> {
    const actualizado = await this.prisma.producto.update({
      where: { id },
      data: { stockActual: nuevoStock },
    });

    return this.aDominio(actualizado);
  }

  async actualizar(producto: Producto): Promise<Producto> {
    const actualizado = await this.prisma.producto.update({
      where: { id: producto.id },
      data: {
        nombre: producto.nombre,
        precioVenta: producto.precioVenta,
        activo: producto.activo,
        cobraPorTiempo: producto.cobraPorTiempo,
        tarifaPorHora: producto.tarifaPorHora,
      },
    });

    return this.aDominio(actualizado);
  }

  private aDominio(registro: ProductoPrisma): Producto {
    return new Producto(
      registro.id,
      registro.nombre,
      registro.costoUnitario.toNumber(),
      registro.precioVenta.toNumber(),
      registro.stockActual,
      registro.activo,
      registro.createdAt,
      registro.cobraPorTiempo,
      registro.tarifaPorHora ? registro.tarifaPorHora.toNumber() : null,
    );
  }
}
