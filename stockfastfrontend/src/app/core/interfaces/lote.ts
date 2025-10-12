import { Producto } from "./product";
export interface Lote {
  proveedor: string;
  agenciaenvio: string;
  gastosenvio: number;
  fechacompra: string;
  productos: Producto[];
}
