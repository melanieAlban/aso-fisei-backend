-- AlterTable: gastos — agregar columnas de split, conservando "moneda" para backfill
ALTER TABLE "gastos" ADD COLUMN     "montoEfectivoFondo" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "montoTransferenciaFondo" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- Backfill: traducir la moneda única existente a la columna de split correspondiente
UPDATE "gastos"
SET "montoEfectivoFondo" = CASE WHEN "moneda" = 'EFECTIVO' THEN "monto" ELSE 0 END,
    "montoTransferenciaFondo" = CASE WHEN "moneda" = 'TRANSFERENCIA' THEN "monto" ELSE 0 END
WHERE "moneda" IS NOT NULL;

-- Ahora sí se puede borrar la columna vieja
ALTER TABLE "gastos" DROP COLUMN "moneda";

-- AlterTable: ventas — agregar columnas de split y relajar metodoPago a nullable
ALTER TABLE "ventas" ADD COLUMN     "montoEfectivo" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "montoTransferencia" DECIMAL(10,2) NOT NULL DEFAULT 0,
ALTER COLUMN "metodoPago" DROP NOT NULL;

-- Backfill: traducir el metodoPago único existente + total a las columnas de split
UPDATE "ventas"
SET "montoEfectivo" = CASE WHEN "metodoPago" = 'EFECTIVO' THEN "total" ELSE 0 END,
    "montoTransferencia" = CASE WHEN "metodoPago" = 'TRANSFERENCIA' THEN "total" ELSE 0 END;
