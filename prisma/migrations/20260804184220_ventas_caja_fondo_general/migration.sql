-- CreateEnum
CREATE TYPE "EstadoCaja" AS ENUM ('ABIERTA', 'CERRADA');

-- CreateEnum
CREATE TYPE "ClasificacionDiferencia" AS ENUM ('GANANCIA', 'PERDIDA', 'PENDIENTE');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('EFECTIVO', 'TRANSFERENCIA');

-- CreateEnum
CREATE TYPE "EstadoAlquiler" AS ENUM ('DEVUELTO', 'PENDIENTE');

-- CreateEnum
CREATE TYPE "EstadoDetalleVenta" AS ENUM ('ACTIVO', 'ANULADO');

-- CreateEnum
CREATE TYPE "TipoMovimientoFondo" AS ENUM ('RETIRO_CAJA', 'GASTO', 'AJUSTE_INICIAL', 'UTILIDAD_EVENTO');

-- CreateTable
CREATE TABLE "cajas" (
    "id" TEXT NOT NULL,
    "usuarioAperturaId" TEXT NOT NULL,
    "usuarioCierreId" TEXT,
    "fondoInicialEfectivo" DECIMAL(10,2) NOT NULL,
    "estado" "EstadoCaja" NOT NULL DEFAULT 'ABIERTA',
    "fechaApertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaCierre" TIMESTAMP(3),

    CONSTRAINT "cajas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arqueos_caja" (
    "id" TEXT NOT NULL,
    "cajaId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "efectivoEsperado" DECIMAL(10,2) NOT NULL,
    "efectivoContado" DECIMAL(10,2) NOT NULL,
    "transferenciaEsperado" DECIMAL(10,2) NOT NULL,
    "transferenciaContado" DECIMAL(10,2) NOT NULL,
    "montoRetiradoEfectivo" DECIMAL(10,2) NOT NULL,
    "montoRetiradoTransferencia" DECIMAL(10,2) NOT NULL,
    "montoDejadoFondoCambio" DECIMAL(10,2) NOT NULL,
    "clasificacionDiferencia" "ClasificacionDiferencia",
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "arqueos_caja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ventas" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "cajaId" TEXT NOT NULL,
    "metodoPago" "MetodoPago" NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ventas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_venta" (
    "id" TEXT NOT NULL,
    "ventaId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DECIMAL(10,2) NOT NULL,
    "esAlquiler" BOOLEAN NOT NULL DEFAULT false,
    "estadoAlquiler" "EstadoAlquiler",
    "estado" "EstadoDetalleVenta" NOT NULL DEFAULT 'ACTIVO',
    "motivoAnulacion" TEXT,
    "usuarioAnulacionId" TEXT,

    CONSTRAINT "detalle_venta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimientos_fondo_general" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "tipo" "TipoMovimientoFondo" NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "metodoPago" "MetodoPago" NOT NULL,
    "saldoResultanteEfectivo" DECIMAL(10,2) NOT NULL,
    "saldoResultanteTransferencia" DECIMAL(10,2) NOT NULL,
    "referenciaId" TEXT,
    "descripcion" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimientos_fondo_general_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saldo_global" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "saldoEfectivo" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "saldoTransferencia" DECIMAL(10,2) NOT NULL DEFAULT 0,

    CONSTRAINT "saldo_global_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "arqueos_caja_cajaId_key" ON "arqueos_caja"("cajaId");

-- AddForeignKey
ALTER TABLE "arqueos_caja" ADD CONSTRAINT "arqueos_caja_cajaId_fkey" FOREIGN KEY ("cajaId") REFERENCES "cajas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_cajaId_fkey" FOREIGN KEY ("cajaId") REFERENCES "cajas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_venta" ADD CONSTRAINT "detalle_venta_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "ventas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
