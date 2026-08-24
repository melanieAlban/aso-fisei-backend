/**
 * Script de mantenimiento de UNA SOLA EJECUCIÓN — NO forma parte del seed
 * automático ni de ninguna migración. Borra de forma IRREVERSIBLE todos los
 * datos transaccionales de prueba de la base de datos real, dejando solo la
 * estructura (usuario admin, roles, permisos) y el saldo real del Fondo
 * General.
 *
 * Uso:
 *   npx ts-node prisma/reset-datos-prueba.ts             (solo muestra qué haría)
 *   npx ts-node prisma/reset-datos-prueba.ts --confirmar (ejecuta de verdad)
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SALDO_EFECTIVO_REAL = 850.77;
const SALDO_TRANSFERENCIA_REAL = 0;
const CLAVE_STOCK_MINIMO = 'stock_minimo_global';
const STOCK_MINIMO_DEFECTO = '10';

// Orden sin importancia real: se borran con TRUNCATE ... CASCADE en un solo
// statement, así que Postgres resuelve las dependencias de FK automáticamente.
const TABLAS_TRANSACCIONALES = [
  'ventas',
  'detalle_venta',
  'movimientos_inventario',
  'productos',
  'cajas',
  'arqueos_caja',
  'gastos',
  'deudas',
  'abonos_deuda',
  'eventos',
  'tipos_entrada',
  'asignaciones_entradas',
  'ingresos_evento',
  'gastos_evento',
  'movimientos_fondo_general',
  'auditoria',
];

function descripcionConexion(): string {
  const url = process.env.DATABASE_URL;
  if (!url) return '(DATABASE_URL no definida)';
  try {
    const parsed = new URL(url);
    return `${parsed.hostname}${parsed.pathname}`;
  } catch {
    return '(no se pudo interpretar DATABASE_URL)';
  }
}

async function contarRegistros(): Promise<Record<string, number>> {
  const conteos: Record<string, number> = {};

  for (const tabla of TABLAS_TRANSACCIONALES) {
    const resultado = await prisma.$queryRawUnsafe<{ count: bigint }[]>(
      `SELECT COUNT(*)::bigint AS count FROM "${tabla}"`,
    );
    conteos[tabla] = Number(resultado[0].count);
  }

  conteos['usuarios (total)'] = await prisma.usuario.count();
  conteos['usuarios (no-admin)'] = await prisma.usuario.count({
    where: { usuario: { not: 'admin' } },
  });

  return conteos;
}

function imprimirConteos(titulo: string, conteos: Record<string, number>): void {
  console.log(`\n${titulo}`);
  console.log('-'.repeat(titulo.length));
  for (const [tabla, cantidad] of Object.entries(conteos)) {
    console.log(`  ${tabla.padEnd(24)} ${cantidad}`);
  }
}

async function main(): Promise<void> {
  const confirmar = process.argv.includes('--confirmar');
  const conexion = descripcionConexion();

  if (!confirmar) {
    console.log(`
⚠️  RESET DE DATOS DE PRUEBA — este script BORRA datos de forma IRREVERSIBLE.

Base de datos objetivo: ${conexion}

Qué haría (nada de esto se ejecutó todavía):
  1. Borrar TODOS los registros de:
       ${TABLAS_TRANSACCIONALES.join(', ')}
  2. Borrar todos los usuarios EXCEPTO "admin" (y sus filas en usuario_rol /
     usuario_permiso_extra) — roles, permisos y rol_permiso quedan intactos.
  3. Fijar el saldo del Fondo General en:
       saldoEfectivo = ${SALDO_EFECTIVO_REAL}
       saldoTransferencia = ${SALDO_TRANSFERENCIA_REAL}
  4. Dejar configuracion_sistema ("${CLAVE_STOCK_MINIMO}") en "${STOCK_MINIMO_DEFECTO}"
     solo si no existe todavía — si ya existe, no se toca.

No se realizó ningún cambio. Para ejecutar de verdad:

  npx ts-node prisma/reset-datos-prueba.ts --confirmar
`);
    process.exit(1);
  }

  console.log(`Base de datos objetivo: ${conexion}`);
  console.log('\nConteo ANTES de borrar (evidencia):');
  const conteoAntes = await contarRegistros();
  imprimirConteos('ANTES', conteoAntes);

  console.log('\nEjecutando reset dentro de una transacción...');

  await prisma.$transaction(
    async (tx) => {
      const listaTablas = TABLAS_TRANSACCIONALES.map((t) => `"${t}"`).join(', ');
      await tx.$executeRawUnsafe(`TRUNCATE TABLE ${listaTablas} CASCADE;`);
      console.log(`  ✔ TRUNCATE CASCADE aplicado a: ${TABLAS_TRANSACCIONALES.join(', ')}`);

      const permisosExtraBorrados = await tx.$executeRaw`
        DELETE FROM usuario_permiso_extra
        WHERE "usuarioId" IN (SELECT id FROM usuarios WHERE usuario != 'admin')
           OR "otorgadoPorUsuarioId" IN (SELECT id FROM usuarios WHERE usuario != 'admin')
      `;
      console.log(`  ✔ usuario_permiso_extra: ${permisosExtraBorrados} fila(s) borrada(s)`);

      const rolesBorrados = await tx.$executeRaw`
        DELETE FROM usuario_rol
        WHERE "usuarioId" IN (SELECT id FROM usuarios WHERE usuario != 'admin')
      `;
      console.log(`  ✔ usuario_rol: ${rolesBorrados} fila(s) borrada(s)`);

      const usuariosBorrados = await tx.$executeRaw`
        DELETE FROM usuarios WHERE usuario != 'admin'
      `;
      console.log(`  ✔ usuarios: ${usuariosBorrados} fila(s) borrada(s) (se conservó "admin")`);

      await tx.$executeRaw`
        UPDATE saldo_global
        SET "saldoEfectivo" = ${SALDO_EFECTIVO_REAL}, "saldoTransferencia" = ${SALDO_TRANSFERENCIA_REAL}
        WHERE id = 1
      `;
      console.log(
        `  ✔ saldo_global: saldoEfectivo=${SALDO_EFECTIVO_REAL}, saldoTransferencia=${SALDO_TRANSFERENCIA_REAL}`,
      );

      const configExistente = await tx.configuracionSistema.findUnique({
        where: { clave: CLAVE_STOCK_MINIMO },
      });
      if (!configExistente) {
        await tx.configuracionSistema.create({
          data: { clave: CLAVE_STOCK_MINIMO, valor: STOCK_MINIMO_DEFECTO },
        });
        console.log(`  ✔ ${CLAVE_STOCK_MINIMO}: creado con valor por defecto "${STOCK_MINIMO_DEFECTO}"`);
      } else {
        console.log(`  · ${CLAVE_STOCK_MINIMO}: ya existe con valor "${configExistente.valor}" — sin cambios`);
      }
    },
    { timeout: 30000 },
  );

  console.log('\nConteo DESPUÉS de borrar:');
  const conteoDespues = await contarRegistros();
  imprimirConteos('DESPUÉS', conteoDespues);

  const saldoFinal = await prisma.saldoGlobal.findUnique({ where: { id: 1 } });
  console.log('\nSaldo final del Fondo General:');
  console.log(`  Efectivo:      ${saldoFinal?.saldoEfectivo.toString() ?? '(sin fila saldo_global id=1)'}`);
  console.log(`  Transferencia: ${saldoFinal?.saldoTransferencia.toString() ?? '(sin fila saldo_global id=1)'}`);

  console.log('\n✅ Reset completado. La base de datos está lista para producción real.');
}

main()
  .catch((error) => {
    console.error('❌ Error durante el reset — no se garantiza que nada se haya aplicado (la transacción se revierte ante cualquier error):', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
