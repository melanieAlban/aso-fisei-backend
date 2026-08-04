-- CreateEnum
CREATE TYPE "TipoDeuda" AS ENUM ('POR_COBRAR', 'POR_PAGAR');

-- CreateEnum
CREATE TYPE "EstadoDeuda" AS ENUM ('PENDIENTE', 'PARCIAL', 'CANCELADA');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TipoMovimientoFondo" ADD VALUE 'ABONO_DEUDA_RECIBIDO';
ALTER TYPE "TipoMovimientoFondo" ADD VALUE 'ABONO_DEUDA_PAGADO';

-- AlterTable
ALTER TABLE "gastos" ADD COLUMN     "moneda" "MetodoPago",
ADD COLUMN     "motivoAnulacion" TEXT,
ADD COLUMN     "usuarioAnulacionId" TEXT;

-- CreateTable
CREATE TABLE "deudas" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "gastoId" TEXT,
    "tipo" "TipoDeuda" NOT NULL,
    "contraparte" TEXT NOT NULL,
    "montoTotal" DECIMAL(10,2) NOT NULL,
    "montoAbonado" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "estado" "EstadoDeuda" NOT NULL DEFAULT 'PENDIENTE',
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deudas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "abonos_deuda" (
    "id" TEXT NOT NULL,
    "deudaId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "metodoPago" "MetodoPago" NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "abonos_deuda_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "deudas" ADD CONSTRAINT "deudas_gastoId_fkey" FOREIGN KEY ("gastoId") REFERENCES "gastos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "abonos_deuda" ADD CONSTRAINT "abonos_deuda_deudaId_fkey" FOREIGN KEY ("deudaId") REFERENCES "deudas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
