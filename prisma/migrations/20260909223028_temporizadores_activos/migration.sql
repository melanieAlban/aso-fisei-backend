-- CreateTable
CREATE TABLE "temporizadores_activos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "horaInicio" TIMESTAMP(3) NOT NULL,
    "horaFin" TIMESTAMP(3) NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "temporizadores_activos_pkey" PRIMARY KEY ("id")
);
