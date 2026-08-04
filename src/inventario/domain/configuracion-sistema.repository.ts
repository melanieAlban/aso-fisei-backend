export interface ConfiguracionSistemaRepository {
  obtener(clave: string): Promise<string | null>;

  actualizar(clave: string, valor: string): Promise<void>;
}
