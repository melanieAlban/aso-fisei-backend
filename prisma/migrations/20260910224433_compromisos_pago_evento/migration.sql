-- CreateTable
CREATE TABLE "compromisos_pago_evento" (
    "id" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "montoTotal" DECIMAL(10,2) NOT NULL,
    "montoPagado" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "compromisos_pago_evento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "compromisos_pago_evento" ADD CONSTRAINT "compromisos_pago_evento_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
