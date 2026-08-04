import { Producto } from './producto.entity';

export interface ProductoRepository {
  crear(producto: Producto): Promise<Producto>;

  buscarPorId(id: string): Promise<Producto | null>;

  listarTodos(page: number, limit: number): Promise<{ productos: Producto[]; total: number }>;

  listarConPocoStock(umbral: number): Promise<Producto[]>;

  actualizarStock(id: string, nuevoStock: number): Promise<Producto>;

  actualizar(producto: Producto): Promise<Producto>;
}
