export interface Product {
  name: string;
  quantity: number;
  purchase_price: number;
  estimated_sale_price: number;
  category_id: number;
  description?: string; // opcional si puede ir vacío
}
