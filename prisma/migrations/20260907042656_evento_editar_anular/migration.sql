-- AlterEnum
ALTER TYPE "EstadoEvento" ADD VALUE 'ANULADO';

-- AlterTable
ALTER TABLE "eventos" ADD COLUMN     "motivoAnulacion" TEXT,
ADD COLUMN     "usuarioAnulacionId" TEXT;
