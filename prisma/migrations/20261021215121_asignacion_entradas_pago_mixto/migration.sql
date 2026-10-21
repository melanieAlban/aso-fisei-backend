-- AlterTable
ALTER TABLE "asignaciones_entradas" ADD COLUMN     "montoEfectivo" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "montoTransferencia" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- Backfill: las asignaciones que ya tenian dinero reportado tenian
-- metodoPago fijo (EFECTIVO o TRANSFERENCIA) con el monto completo en esa
-- moneda. Se refleja eso en las columnas nuevas para que el cierre de evento
-- siga contando correctamente ese dinero ya registrado. Las que todavia no
-- tienen metodoPago (nada reportado aun) quedan en 0/0, consistente con su
-- dineroRecibido en 0.
UPDATE "asignaciones_entradas" SET "montoEfectivo" = "dineroRecibido" WHERE "metodoPago" = 'EFECTIVO';
UPDATE "asignaciones_entradas" SET "montoTransferencia" = "dineroRecibido" WHERE "metodoPago" = 'TRANSFERENCIA';
