<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Requests\SaleRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\UpdateSaleRequest;

class SaleController extends Controller
{
    public function updateStock($id, $quantity)
    {
        $product = Product::find($id);

        if (!$product) {
            throw new \Exception('Producto no encontrado');
        }

        $newQuantity = $product->quantity - $quantity;

        if ($newQuantity < 0) {
            throw new \Exception('Stock insuficiente');
        }

        $product->quantity = $newQuantity;
        $product->save();
    }

    public function store(SaleRequest $request)
    {
        try {
            $user = Auth::user();
            $data = $request->all();
            $data['user_id'] = $user->id;

            $this->updateStock($data['product_id'], $data['quantity']);

            $sale = Sale::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Venta creada y stock actualizado correctamente',
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Error en store@SaleController', ['exception' => $th->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => $th->getMessage()
            ], 400);
        }
    }

    public function deleteSale($id)
    {
        try {
            $sale = Sale::find($id);

            if (!$sale) {
                return response()->json([
                    'success' => false,
                    'message' => 'Venta no encontrada'
                ], 404);
            }

            // Restaurar el stock del producto
            $product = Product::find($sale->product_id);
            if ($product) {
                $product->quantity += $sale->quantity;
                $product->save();
            }

            $sale->delete();

            return response()->json([
                'success' => true,
                'message' => 'Venta eliminada y stock restaurado correctamente'
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Error en deleteSale@SaleController', ['exception' => $th->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la venta'
            ], 400);
        }
    }

    public function updateSale(UpdateSaleRequest $request, $id)
    {
        try {
            DB::beginTransaction();

            // Bloquear la venta para evitar race conditions
            $sale = Sale::lockForUpdate()->find($id);

            if (!$sale) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Venta no encontrada'
                ], 404);
            }

            // Obtener valores antiguos y nuevos
            $oldQuantity = $sale->quantity;
            $newQuantity = $request->quantity;
            $quantityDifference = $newQuantity - $oldQuantity;

            // Si está aumentando la cantidad, verificar stock disponible
            if ($quantityDifference > 0) {
                // Obtener el producto con bloqueo
                $product = Product::lockForUpdate()->find($sale->product_id);

                if (!$product) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => 'Producto no encontrado'
                    ], 404);
                }

                // Verificar si hay suficiente stock
                if ($product->stock < $quantityDifference) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => "Stock insuficiente.",
                        'type' => 'insufficient_stock'
                    ], 400);
                }

                // Reducir el stock
                $product->stock -= $quantityDifference;
                $product->save();
            }
            // Si está reduciendo la cantidad, devolver al stock
            else if ($quantityDifference < 0) {
                $product = Product::lockForUpdate()->find($sale->product_id);

                if ($product) {
                    // Devolver las unidades al stock
                    $product->stock += abs($quantityDifference);
                    $product->save();
                }
            }

            // Actualizar la venta
            $sale->update($request->all());

            // Recalcular beneficios (si es necesario)
            $sale->load('product');

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Venta actualizada correctamente',
                'venta' => $sale
            ], 200);
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error('Error en updateSale@SaleController', [
                'exception' => $th->getMessage(),
                'trace' => $th->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la venta'
            ], 400);
        }
    }


    /**
     * Obtiene todas las ventas del usuario autenticado
     */

    public function getSales()
    {
        $user = Auth::user();
        try {
            $sales = Sale::with('product', 'product.purchase', 'product.category')
                ->where('user_id', $user->id)
                ->orderBy('sale_date', 'desc')
                ->get();

            $transformedSales = $sales->map(function ($sale) {
                return $this->transformSale($sale);
            });

            return response()->json([
                'success' => true,
                'data' => $transformedSales
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Error en getSales@SaleController', [
                'exception' => $th->getMessage(),
                'trace' => $th->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las ventas'
            ], 400);
        }
    }

    /**
     * Transforma una venta agregando cálculos
     */
    private function transformSale($sale)
    {
        $purchasePrice = $this->getPurchasePrice($sale);
        $shippingCostPerUnit = $this->calculateShippingCostPerProduct($sale);
        $quantitySold = $sale->quantity;

        // Precio de venta unitario
        $salePricePerUnit = $this->getSalePrice($sale);

        // Calcular TOTALES multiplicando por cantidad vendida
        $totalSalePrice = $salePricePerUnit * $quantitySold;
        $totalPurchasePrice = $purchasePrice * $quantitySold;
        $totalShippingCost = $shippingCostPerUnit * $quantitySold;

        // Coste total
        $totalCost = $this->calculateTotalCost($totalPurchasePrice, $totalShippingCost);

        // Beneficio = ingresos totales - costes totales
        $benefit = $this->calculateBenefit($totalSalePrice, $totalCost);
        $benefitPercent = $this->calculateBenefitPercent($benefit, $totalSalePrice); // Cambiado


        return [
            'id' => $sale->id,
            'product' => $sale->product,
            'sale_date' => $sale->sale_date,
            'quantity' => $quantitySold,
            'purchase_price' => round($purchasePrice, 2), // Unitario
            'shipping_cost' => round($shippingCostPerUnit, 2), // Unitario
            'sale_price' => round($salePricePerUnit, 2), // Unitario (como antes)
            'total_purchase_price' => round($totalPurchasePrice, 2), // Total
            'total_shipping_cost' => round($totalShippingCost, 2), // Total
            'benefit' => round($benefit, 2), // TOTAL (considerando cantidad)
            'benefitPercent' => round($benefitPercent, 2) // Porcentaje sobre total
        ];
    }

    /**
     * Obtiene el precio de venta UNITARIO del producto
     */
    private function getSalePrice($sale)
    {
        return floatval($sale->sale_price);
    }

    /**
     * Obtiene el precio de compra UNITARIO del producto
     */
    private function getPurchasePrice($sale)
    {
        return floatval($sale->product->purchase_price);
    }

    /**
     * Calcula el gasto de envío proporcional POR UNIDAD de producto
     */
    private function calculateShippingCostPerProduct($sale)
    {
        // Obtener gastos de envío totales del lote
        $totalShippingCost = floatval($sale->product->purchase->shipping_cost ?? 0);

        // Contar TODAS las unidades ORIGINALMENTE COMPRADAS en el lote
        $totalUnitsInPurchase = $this->countTotalUnitsInPurchase($sale->product->purchase_id);

        // Calcular gasto de envío por unidad
        return $totalUnitsInPurchase > 0
            ? $totalShippingCost / $totalUnitsInPurchase
            : 0;
    }

    /**
     * Cuenta el TOTAL de unidades ORIGINALMENTE COMPRADAS en un lote
     * Suma: cantidad actual + cantidad ya vendida
     */
    private function countTotalUnitsInPurchase($purchaseId)
    {
        // Obtener todos los productos del lote
        $products = Product::where('purchase_id', $purchaseId)->get();

        $totalUnits = 0;

        foreach ($products as $product) {
            // Stock actual
            $currentStock = $product->quantity;

            // Unidades vendidas de este producto
            $soldUnits = Sale::where('product_id', $product->id)->sum('quantity');

            // Total original = stock actual + vendidas
            $totalUnits += ($currentStock + $soldUnits);
        }

        return $totalUnits;
    }

    /**
     * Calcula el coste total (compra + envío)
     */
    private function calculateTotalCost($totalPurchasePrice, $totalShippingCost)
    {
        return $totalPurchasePrice + $totalShippingCost;
    }

    /**
     * Calcula el beneficio
     */
    private function calculateBenefit($salePrice, $totalCost)
    {
        return $salePrice - $totalCost;
    }

    /**
     * Calcula el porcentaje de beneficio (Profit Margin)
     */
    private function calculateBenefitPercent($benefit, $totalSalePrice)
    {
        return $totalSalePrice > 0
            ? ($benefit / $totalSalePrice) * 100
            : 0;
    }
}
