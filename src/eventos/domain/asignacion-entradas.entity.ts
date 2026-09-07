export type MetodoPagoAsignacion = 'EFECTIVO' | 'TRANSFERENCIA';

export class AsignacionEntradas {
  constructor(
    public readonly id: string,
    public readonly tipoEntradaId: string,
    public readonly usuarioRegistroId: string,
    public readonly nombreReferencia: string,
    public readonly cantidadAsignada: number,
    public readonly cantidadVendida: number,
    public readonly cantidadDevuelta: number,
    public readonly dineroRecibido: number,
    public readonly metodoPago: MetodoPagoAsignacion | null,
    public readonly fecha: Date,
    public readonly cantidadVendidaCombo: number = 0,
    public readonly telefono: string | null = null,
    public readonly semestre: string | null = null,
    public readonly carrera: string | null = null,
  ) {
    if (nombreReferencia.trim().length === 0) {
      throw new Error('La referencia es requerida');
    }
    if (cantidadAsignada <= 0) {
      throw new Error('La cantidad asignada debe ser mayor a 0');
    }
    if (cantidadVendida < 0 || cantidadDevuelta < 0) {
      throw new Error('Las cantidades vendida y devuelta no pueden ser negativas');
    }
    if (cantidadVendida + cantidadDevuelta > cantidadAsignada) {
      throw new Error('La cantidad vendida más devuelta no puede exceder la cantidad asignada');
    }
    if (cantidadVendidaCombo < 0) {
      throw new Error('La cantidad vendida en combo no puede ser negativa');
    }
    if (cantidadVendidaCombo > cantidadVendida) {
      throw new Error('La cantidad vendida en combo no puede exceder la cantidad vendida total');
    }
    if (dineroRecibido < 0) {
      throw new Error('El dinero recibido no puede ser negativo');
    }
    if (dineroRecibido > 0 && !metodoPago) {
      throw new Error('Debe indicar el método de pago cuando hay dinero recibido');
    }
  }
}
