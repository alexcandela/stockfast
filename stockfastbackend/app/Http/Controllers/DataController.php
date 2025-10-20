<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class DataController extends Controller
{
    // ==================== CÁLCULO DE COSTOS ====================
    
    private function obtenerCostoRealProducto($product)
    {
        if (!$product || !$product->purchase) {
            return $product->purchase_price ?? 0;
        }

        $purchase = $product->purchase;
        $totalQty = $purchase->products->sum('quantity');
        $shippingShare = $totalQty > 0 
            ? $purchase->shipping_cost / $totalQty 
            : 0;

        return $product->purchase_price + $shippingShare;
    }

    // ==================== CÁLCULO DE INGRESOS ====================
    
    private function calcularIngresosBrutos($sales)
    {
        return $sales->sum(function ($sale) {
            return $sale->sale_price * ($sale->quantity ?? 1);
        });
    }

    private function calcularCostosTotales($sales)
    {
        return $sales->sum(function ($sale) {
            $productCost = $this->obtenerCostoRealProducto($sale->product);
            return $productCost * ($sale->quantity ?? 1);
        });
    }

    private function calcularNetosVentas($sales)
    {
        return $this->calcularIngresosBrutos($sales) - $this->calcularCostosTotales($sales);
    }

    private function calcularVariacionPorcentual($valorActual, $valorAnterior)
    {
        if ($valorAnterior <= 0) {
            return 0;
        }
        return (($valorActual - $valorAnterior) / $valorAnterior) * 100;
    }

    public function calcularIngresos($sales, $salesPrevMonth = null)
    {
        $brutos = $this->calcularIngresosBrutos($sales);
        $costes = $this->calcularCostosTotales($sales);
        $netos = $brutos - $costes;
        $margenBruto = $brutos > 0 ? ($netos / $brutos) * 100 : 0;

        $ingresos = [
            'brutos' => round($brutos, 2),
            'netos' => round($netos, 2),
            'margen_bruto' => round($margenBruto, 2),
        ];

        if ($salesPrevMonth) {
            $prevNetos = $this->calcularNetosVentas($salesPrevMonth);
            $ingresos['variacion_mes'] = round(
                $this->calcularVariacionPorcentual($netos, $prevNetos), 
                2
            );
        } else {
            $ingresos['variacion_mes'] = 0;
        }

        return $ingresos;
    }

    // ==================== CÁLCULO DE VENTAS ====================
    
    private function contarVentasTotales($sales)
    {
        return $sales->sum(fn($sale) => $sale->quantity ?? 1);
    }

    private function obtenerProductoMasVendido($sales)
    {
        $productsCount = $sales->groupBy(fn($sale) => $sale->product->name ?? 'Desconocido')
            ->map(fn($group) => $group->sum(fn($sale) => $sale->quantity ?? 1))
            ->sortDesc();

        if ($productsCount->isEmpty()) {
            return ['name' => 'Ninguno', 'quantity' => 0];
        }

        return [
            'name' => $productsCount->keys()->first(),
            'quantity' => $productsCount->first()
        ];
    }

    public function calcularNumVentas($sales, $salesPrevMonth = null)
    {
        $numActual = $this->contarVentasTotales($sales);

        $salesNum = [
            'quantity' => $numActual,
            'product' => $this->obtenerProductoMasVendido($sales),
        ];

        if ($salesPrevMonth) {
            $numPrev = $this->contarVentasTotales($salesPrevMonth);
            $salesNum['variacion_mes'] = round(
                $this->calcularVariacionPorcentual($numActual, $numPrev), 
                2
            );
        } else {
            $salesNum['variacion_mes'] = 0;
        }

        return $salesNum;
    }

    // ==================== VALIDACIÓN DE ACCESO ====================
    
    private function validarAccesoPlanFree($month, $plan)
    {
        if ($plan !== 'Free' || !$month || $month === 'total') {
            return true;
        }

        $now = Carbon::now();
        $currentMonth = $now->format('Y-m');
        $previousMonth = $now->copy()->subMonth()->format('Y-m');

        return in_array($month, [$currentMonth, $previousMonth]);
    }

    // ==================== OBTENCIÓN DE DATOS ====================
    
    private function obtenerVentasPorMes($userId, $month)
    {
        $query = Sale::with(['product.category'])->where('user_id', $userId);

        if ($month && $month !== 'total') {
            $start = Carbon::parse($month . '-01')->startOfMonth();
            $end = Carbon::parse($month . '-01')->endOfMonth();
            $query->whereBetween('sale_date', [$start, $end]);
        }

        return $query->get();
    }

    private function obtenerVentasMesAnterior($userId, $month)
    {
        if (!$month || $month === 'total') {
            return null;
        }

        $start = Carbon::parse($month . '-01')->startOfMonth();
        $startPrev = $start->copy()->subMonth()->startOfMonth();
        $endPrev = $start->copy()->subMonth()->endOfMonth();

        return Sale::with(['product.category'])
            ->where('user_id', $userId)
            ->whereBetween('sale_date', [$startPrev, $endPrev])
            ->get();
    }

    // ==================== ENDPOINT PRINCIPAL ====================
    
    public function getGeneralData(Request $request)
    {
        $user = Auth::user();
        $month = $request->query('month');
        $plan = $user->plan->name ?? 'Free';

        try {
            // Validar acceso para usuarios Free
            if (!$this->validarAccesoPlanFree($month, $plan)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tu plan Free solo permite ver las ventas del mes actual y anterior.'
                ], 403);
            }

            // Obtener datos
            $sales = $this->obtenerVentasPorMes($user->id, $month);
            $salesPrevMonth = $this->obtenerVentasMesAnterior($user->id, $month);

            // Calcular métricas
            $ingresos = $this->calcularIngresos($sales, $salesPrevMonth);
            $quantitySales = $this->calcularNumVentas($sales, $salesPrevMonth);

            $stockTotal = Product::join('purchases', 'products.purchase_id', '=', 'purchases.id')
                ->where('purchases.user_id', $user->id)
                ->sum('products.quantity') ?? 0;

            return response()->json([
                'success' => true,
                'data' => $sales,
                'ingresos' => $ingresos,
                'numeroVentas' => $quantitySales,
                'stockTotal' => $stockTotal
            ], 200);

        } catch (\Throwable $th) {
            Log::error('Error en getGeneralData@DataController', [
                'exception' => $th->getMessage(),
                'trace' => $th->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los datos.'
            ], 500);
        }
    }
}