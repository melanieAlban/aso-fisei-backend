-- CreateTable
CREATE TABLE "ventas_entrada" (
    "id" TEXT NOT NULL,
    "tipoEntradaId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "cantidadCombo" INTEGER NOT NULL DEFAULT 0,
    "monto" DECIMAL(10,2) NOT NULL,
    "metodoPago" "MetodoPago" NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ventas_entrada_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ventas_entrada" ADD CONSTRAINT "ventas_entrada_tipoEntradaId_fkey" FOREIGN KEY ("tipoEntradaId") REFERENCES "tipos_entrada"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
