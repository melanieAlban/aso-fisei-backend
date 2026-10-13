-- AlterTable
ALTER TABLE "ventas_entrada" ADD COLUMN     "montoEfectivo" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "montoTransferencia" DECIMAL(10,2) NOT NULL DEFAULT 0,
ALTER COLUMN "metodoPago" DROP NOT NULL;

-- Backfill: las ventas de entradas existentes ya tenian metodoPago fijo
-- (EFECTIVO o TRANSFERENCIA) con el monto completo en esa moneda. Se
-- refleja eso en las columnas nuevas para que el cierre de evento siga
-- contando correctamente ese dinero ya registrado.
UPDATE "ventas_entrada" SET "montoEfectivo" = "monto" WHERE "metodoPago" = 'EFECTIVO';
UPDATE "ventas_entrada" SET "montoTransferencia" = "monto" WHERE "metodoPago" = 'TRANSFERENCIA';
