-- AlterTable
ALTER TABLE "detalle_venta" ADD COLUMN     "duracionMinutos" INTEGER;

-- AlterTable
ALTER TABLE "productos" ADD COLUMN     "cobraPorTiempo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tarifaPorHora" DECIMAL(10,2);
