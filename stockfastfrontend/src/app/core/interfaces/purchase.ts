import { Product } from "./product";
export interface Purchase {
  supplier_name?: string;
  shipping_agency?: string;
  shipping_cost: number;
  purchase_date: string;
  products: Product[];
}
