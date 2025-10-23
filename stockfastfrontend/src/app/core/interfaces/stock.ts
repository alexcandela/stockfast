export interface Stock {
  valor_stock: number;
  valor_potencial: number;
  posibles_beneficios: number;
  beneficio_porcentual: number;
}

export interface StockResponse {
  success: boolean;
  data: Stock;
}
