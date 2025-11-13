import { Product } from "./product";

export interface Venta {
  id: number;
  product: Product
  sale_date: Date;
  purchase_price: number;
  shipping_cost: number;
  sale_price: number;
  quantity: number;
  benefit: number;
  benefitPercent: number;
  total_purchase_price: number;
  total_shipping_cost: number;
  selected?: boolean;
}

export interface VentaResponse {
  success: boolean;
  data: Venta[];
}