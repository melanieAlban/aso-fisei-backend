import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const PERMISOS: Array<{ codigo: string; descripcion: string }> = [
  { codigo: 'usuarios.crear', descripcion: 'Crear usuarios' },
  { codigo: 'usuarios.listar', descripcion: 'Listar usuarios' },
  { codigo: 'usuarios.editar', descripcion: 'Editar usuarios' },
  { codigo: 'usuarios.desactivar', descripcion: 'Desactivar usuarios' },
  { codigo: 'usuarios.asignar_rol', descripcion: 'Asignar roles a usuarios' },
  { codigo: 'usuarios.otorgar_permiso', descripcion: 'Otorgar permisos individuales a usuarios' },

  { codigo: 'inventario.crear', descripcion: 'Crear artículos de inventario' },
  { codigo: 'inventario.listar', descripcion: 'Listar inventario' },
  { codigo: 'inventario.editar', descripcion: 'Editar artículos de inventario' },
  { codigo: 'inventario.anular', descripcion: 'Anular movimientos de inventario' },
  { codigo: 'inventario.crear_producto', descripcion: 'Crear productos' },
  { codigo: 'inventario.editar_producto', descripcion: 'Editar productos' },
  { codigo: 'inventario.registrar_compra', descripcion: 'Registrar compras de inventario' },
  { codigo: 'inventario.registrar_perdida', descripcion: 'Registrar pérdidas de inventario' },
  { codigo: 'inventario.registrar_ajuste', descripcion: 'Registrar ajustes de inventario' },
  { codigo: 'inventario.editar_configuracion', descripcion: 'Editar configuración del sistema de inventario' },

  { codigo: 'compras.crear', descripcion: 'Registrar compras' },
  { codigo: 'compras.listar', descripcion: 'Listar compras' },

  { codigo: 'ventas.crear', descripcion: 'Registrar ventas' },
  { codigo: 'ventas.listar', descripcion: 'Listar ventas' },
  { codigo: 'ventas.anular', descripcion: 'Anular ventas' },
  { codigo: 'ventas.vender_entradas', descripcion: 'Vender entradas a eventos' },

  { codigo: 'caja.abrir', descripcion: 'Abrir una sesión de caja' },
  { codigo: 'caja.arqueo', descripcion: 'Realizar arqueo de caja' },
  { codigo: 'caja.retiro_fondo', descripcion: 'Retirar dinero del Fondo General' },
  { codigo: 'caja.listar', descripcion: 'Listar movimientos de caja' },

  { codigo: 'fondo_general.ajustar', descripcion: 'Ajustar el saldo inicial del Fondo General' },
  { codigo: 'fondo_general.ver', descripcion: 'Ver saldo y movimientos del Fondo General' },

  { codigo: 'gastos.crear', descripcion: 'Registrar gastos' },
  { codigo: 'gastos.listar', descripcion: 'Listar gastos' },
  { codigo: 'gastos.anular', descripcion: 'Anular gastos' },

  { codigo: 'deudas.crear', descripcion: 'Registrar deudas' },
  { codigo: 'deudas.listar', descripcion: 'Listar deudas' },
  { codigo: 'deudas.editar', descripcion: 'Editar deudas' },

  { codigo: 'eventos.crear', descripcion: 'Crear eventos' },
  { codigo: 'eventos.listar', descripcion: 'Listar eventos' },
  { codigo: 'eventos.editar', descripcion: 'Editar eventos' },
  { codigo: 'eventos.anular', descripcion: 'Anular eventos' },

  { codigo: 'auditoria.listar', descripcion: 'Listar registros de auditoría' },
];

const PERMISOS_VENDEDOR = [
  'ventas.crear',
  'ventas.listar',
  'ventas.vender_entradas',
  'inventario.listar',
];
const PERMISOS_COMPRAS = [
  'compras.crear',
  'compras.listar',
  'inventario.listar',
  'inventario.registrar_compra',
];

async function main() {
  console.log('Sembrando permisos...');
  for (const permiso of PERMISOS) {
    await prisma.permiso.upsert({
      where: { codigo: permiso.codigo },
      update: { descripcion: permiso.descripcion },
      create: permiso,
    });
  }

  console.log('Sembrando roles...');
  const admin = await prisma.rol.upsert({
    where: { nombre: 'Admin' },
    update: {},
    create: { nombre: 'Admin' },
  });
  const vendedor = await prisma.rol.upsert({
    where: { nombre: 'Vendedor' },
    update: {},
    create: { nombre: 'Vendedor' },
  });
  const compras = await prisma.rol.upsert({
    where: { nombre: 'Compras' },
    update: {},
    create: { nombre: 'Compras' },
  });

  console.log('Asignando permisos a roles...');
  const todosLosPermisos = await prisma.permiso.findMany();
  for (const permiso of todosLosPermisos) {
    await prisma.rolPermiso.upsert({
      where: { rolId_permisoId: { rolId: admin.id, permisoId: permiso.id } },
      update: {},
      create: { rolId: admin.id, permisoId: permiso.id },
    });
  }

  for (const codigo of PERMISOS_VENDEDOR) {
    const permiso = await prisma.permiso.findUniqueOrThrow({ where: { codigo } });
    await prisma.rolPermiso.upsert({
      where: { rolId_permisoId: { rolId: vendedor.id, permisoId: permiso.id } },
      update: {},
      create: { rolId: vendedor.id, permisoId: permiso.id },
    });
  }

  for (const codigo of PERMISOS_COMPRAS) {
    const permiso = await prisma.permiso.findUniqueOrThrow({ where: { codigo } });
    await prisma.rolPermiso.upsert({
      where: { rolId_permisoId: { rolId: compras.id, permisoId: permiso.id } },
      update: {},
      create: { rolId: compras.id, permisoId: permiso.id },
    });
  }

  console.log('Creando usuario admin inicial...');
  const passwordAdmin = 'Admin123!';
  const passwordHash = await bcrypt.hash(passwordAdmin, 10);

  const usuarioAdmin = await prisma.usuario.upsert({
    where: { usuario: 'admin' },
    update: {},
    create: {
      nombre: 'Administrador',
      usuario: 'admin',
      passwordHash,
      activo: true,
    },
  });

  await prisma.usuarioRol.upsert({
    where: { usuarioId_rolId: { usuarioId: usuarioAdmin.id, rolId: admin.id } },
    update: {},
    create: { usuarioId: usuarioAdmin.id, rolId: admin.id },
  });

  console.log('Sembrando configuración del sistema...');
  await prisma.configuracionSistema.upsert({
    where: { clave: 'stock_minimo_global' },
    update: {},
    create: { clave: 'stock_minimo_global', valor: '10' },
  });

  console.log('Sembrando saldo global inicial...');
  await prisma.saldoGlobal.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, saldoEfectivo: 0, saldoTransferencia: 0 },
  });

  console.log('Sembrando productos de ejemplo...');
  const PRODUCTOS = [
    { nombre: 'Papas fritas', precioVenta: 1.0 },
    { nombre: 'Chicles', precioVenta: 0.25 },
    { nombre: 'Agua embotellada', precioVenta: 0.75 },
    { nombre: 'Gaseosa', precioVenta: 1.5 },
    { nombre: 'Snacks salados', precioVenta: 1.25 },
    { nombre: 'Dulces surtidos', precioVenta: 0.5 },
  ];

  for (const producto of PRODUCTOS) {
    const existente = await prisma.producto.findFirst({ where: { nombre: producto.nombre } });
    if (!existente) {
      await prisma.producto.create({
        data: { nombre: producto.nombre, precioVenta: producto.precioVenta, stockActual: 0 },
      });
    }
  }

  console.log('Seed completado.');
  console.log(`Usuario admin -> usuario: "admin" | password: "${passwordAdmin}"`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
