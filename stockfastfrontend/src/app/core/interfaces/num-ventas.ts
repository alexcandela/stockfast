export interface ProductVentas {
  name: string;
  quantity: number;
}

export interface NumVentas {
  quantity: number;
  product: ProductVentas;
  variacion_mes: number | null;
}