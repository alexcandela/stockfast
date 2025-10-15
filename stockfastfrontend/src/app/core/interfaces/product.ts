import { Purchase } from "./purchase";
import { Category } from "./category";

export interface Product {
  id?: number;
  name: string;
  quantity: number;
  purchase_price: number;
  estimated_sale_price: number;
  category_id: number;
  description?: string;
  purchase?: Purchase;
  category?: Category;
}

export interface ProductResponse {
  success: boolean;
  products: Product[];
}


