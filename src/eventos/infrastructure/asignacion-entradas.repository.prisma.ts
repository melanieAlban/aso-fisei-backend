import { Injectable } from '@nestjs/common';
import { AsignacionEntradas as AsignacionEntradasPrisma } from '@prisma/client';
import { PrismaService } from '../../shared/infraestructure/prisma/prisma.service';
import { AsignacionEntradas } from '../domain/asignacion-entradas.entity';
import { AsignacionEntradasRepository } from '../domain/asignacion-entradas.repository';

@Injectable()
export class AsignacionEntradasRepositoryPrisma implements AsignacionEntradasRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(asignacion: AsignacionEntradas): Promise<AsignacionEntradas> {
    const creado = await this.prisma.asignacionEntradas.create({
      data: {
        id: asignacion.id,
        tipoEntradaId: asignacion.tipoEntradaId,
        usuarioRegistroId: asignacion.usuarioRegistroId,
        nombreReferencia: asignacion.nombreReferencia,
        telefono: asignacion.telefono,
        semestre: asignacion.semestre,
        carrera: asignacion.carrera,
        cantidadAsignada: asignacion.cantidadAsignada,
        cantidadVendida: asignacion.cantidadVendida,
        cantidadVendidaCombo: asignacion.cantidadVendidaCombo,
        cantidadDevuelta: asignacion.cantidadDevuelta,
        dineroRecibido: asignacion.dineroRecibido,
        metodoPago: asignacion.metodoPago,
        fecha: asignacion.fecha,
      },
    });

    return this.aDominio(creado);
  }

  async actualizar(asignacion: AsignacionEntradas): Promise<AsignacionEntradas> {
    const actualizado = await this.prisma.asignacionEntradas.update({
      where: { id: asignacion.id },
      data: {
        nombreReferencia: asignacion.nombreReferencia,
        telefono: asignacion.telefono,
        semestre: asignacion.semestre,
        carrera: asignacion.carrera,
        cantidadAsignada: asignacion.cantidadAsignada,
        cantidadVendida: asignacion.cantidadVendida,
        cantidadVendidaCombo: asignacion.cantidadVendidaCombo,
        cantidadDevuelta: asignacion.cantidadDevuelta,
        dineroRecibido: asignacion.dineroRecibido,
        metodoPago: asignacion.metodoPago,
      },
    });

    return this.aDominio(actualizado);
  }

  async buscarPorId(id: string): Promise<AsignacionEntradas | null> {
    const encontrado = await this.prisma.asignacionEntradas.findUnique({ where: { id } });
    return encontrado ? this.aDominio(encontrado) : null;
  }

  async listarPorEvento(eventoId: string): Promise<AsignacionEntradas[]> {
    const registros = await this.prisma.asignacionEntradas.findMany({
      where: { tipoEntrada: { eventoId } },
    });

    return registros.map((registro) => this.aDominio(registro));
  }

  private aDominio(registro: AsignacionEntradasPrisma): AsignacionEntradas {
    return new AsignacionEntradas(
      registro.id,
      registro.tipoEntradaId,
      registro.usuarioRegistroId,
      registro.nombreReferencia,
      registro.cantidadAsignada,
      registro.cantidadVendida,
      registro.cantidadDevuelta,
      registro.dineroRecibido.toNumber(),
      registro.metodoPago,
      registro.fecha,
      registro.cantidadVendidaCombo,
      registro.telefono,
      registro.semestre,
      registro.carrera,
    );
  }
}
