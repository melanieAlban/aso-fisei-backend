-- AlterTable
ALTER TABLE "asignaciones_entradas" ADD COLUMN     "cantidadVendidaCombo" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "carrera" TEXT,
ADD COLUMN     "semestre" TEXT,
ADD COLUMN     "telefono" TEXT;

-- AlterTable
ALTER TABLE "tipos_entrada" ADD COLUMN     "cantidadCombo" INTEGER,
ADD COLUMN     "precioCombo" DECIMAL(10,2);
