-- CreateEnum
CREATE TYPE "EstadoEvento" AS ENUM ('ACTIVO', 'CERRADO');

-- CreateTable
CREATE TABLE "eventos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "presupuesto" DECIMAL(10,2),
    "estado" "EstadoEvento" NOT NULL DEFAULT 'ACTIVO',
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3),
    "fechaCierre" TIMESTAMP(3),

    CONSTRAINT "eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_entrada" (
    "id" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "cantidadTotal" INTEGER NOT NULL,

    CONSTRAINT "tipos_entrada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asignaciones_entradas" (
    "id" TEXT NOT NULL,
    "tipoEntradaId" TEXT NOT NULL,
    "usuarioRegistroId" TEXT NOT NULL,
    "nombreReferencia" TEXT NOT NULL,
    "cantidadAsignada" INTEGER NOT NULL,
    "cantidadVendida" INTEGER NOT NULL DEFAULT 0,
    "cantidadDevuelta" INTEGER NOT NULL DEFAULT 0,
    "dineroRecibido" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "metodoPago" "MetodoPago",
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asignaciones_entradas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingresos_evento" (
    "id" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "metodoPago" "MetodoPago" NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ingresos_evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gastos_evento" (
    "id" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "metodoPago" "MetodoPago" NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gastos_evento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tipos_entrada" ADD CONSTRAINT "tipos_entrada_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones_entradas" ADD CONSTRAINT "asignaciones_entradas_tipoEntradaId_fkey" FOREIGN KEY ("tipoEntradaId") REFERENCES "tipos_entrada"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingresos_evento" ADD CONSTRAINT "ingresos_evento_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gastos_evento" ADD CONSTRAINT "gastos_evento_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
