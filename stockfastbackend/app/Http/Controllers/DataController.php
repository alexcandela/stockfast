<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Purchase;
use App\Models\Sale;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class DataController extends Controller
{
    public function calcularIngresos($sales, $salesPrevMonth = null)
    {
        $ingresos = [];

        $brutos = 0;
        $costes = 0;

        foreach ($sales as $sale) {
            $quantity = $sale->quantity ?? 1;
            $productCost = optional($sale->product)->purchase_price ?? 0;

            $brutos += $sale->sale_price * $quantity;
            $costes += $productCost * $quantity;
        }

        $netos = $brutos - $costes;
        $margenBruto = $brutos > 0 ? ($netos / $brutos) * 100 : 0;

        $ingresos['brutos'] = round($brutos, 2);
        $ingresos['netos'] = round($netos, 2);
        $ingresos['margen_bruto'] = round($margenBruto, 2);

        // Variación respecto al mes anterior
        if ($salesPrevMonth) {
            $prevNetos = 0;
            foreach ($salesPrevMonth as $sale) {
                $quantity = $sale->quantity ?? 1;
                $productCost = optional($sale->product)->purchase_price ?? 0;
                $prevNetos += ($sale->sale_price - $productCost) * $quantity;
            }

            $ingresos['variacion_mes'] = $prevNetos > 0
                ? round((($netos - (float)$prevNetos) / (float)$prevNetos) * 100, 2)
                : 0;
        } else {
            $ingresos['variacion_mes'] = 0;
        }

        return $ingresos;
    }

    public function calcularNumVentas($sales, $salesPrevMonth = null)
    {
        $salesNum = [];

        $numActual = 0;
        $productsCount = [];

        foreach ($sales as $sale) {
            $quantity = $sale->quantity ?? 1;
            $numActual += $quantity;

            $productName = optional($sale->product)->name ?? 'Desconocido';
            if (!isset($productsCount[$productName])) {
                $productsCount[$productName] = 0;
            }
            $productsCount[$productName] += $quantity;
        }

        // Producto más vendido
        $maxProductName = null;
        $maxProductQty = 0;
        foreach ($productsCount as $name => $qty) {
            if ($qty > $maxProductQty) {
                $maxProductQty = $qty;
                $maxProductName = $name;
            }
        }

        $salesNum['quantity'] = $numActual ?? 0;
        $salesNum['product'] = [
            'name' => $maxProductName ?? 'Ninguno',
            'quantity' => $maxProductQty ?? 0
        ];

        // Variación respecto al mes anterior
        if ($salesPrevMonth) {
            $numPrev = 0;
            foreach ($salesPrevMonth as $sale) {
                $numPrev += $sale->quantity ?? 1;
            }

            $salesNum['variacion_mes'] = $numPrev > 0
                ? round((($numActual - (float)$numPrev) / (float)$numPrev) * 100, 2)
                : 0;
        } else {
            $salesNum['variacion_mes'] = 0;
        }

        return $salesNum;
    }

    public function getGeneralData(Request $request)
    {
        $user = Auth::user();
        $month = $request->query('month');
        $plan = $user->plan->name ?? 'Free';

        try {
            $query = Sale::with(['product.category'])
                ->where('user_id', $user->id);

            $salesPrevMonth = null;

            if ($month && $month !== 'total') {
                $start = Carbon::parse($month . '-01')->startOfMonth();
                $end = Carbon::parse($month . '-01')->endOfMonth();

                // Restricción plan Free
                if ($plan === 'Free') {
                    $now = Carbon::now();
                    $currentMonth = $now->format('Y-m');
                    $previousMonth = $now->copy()->subMonth()->format('Y-m');

                    if (!in_array($month, [$currentMonth, $previousMonth])) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Tu plan Free solo permite ver las ventas del mes actual y anterior.'
                        ], 403);
                    }
                }

                $query->whereBetween('sale_date', [$start, $end]);

                // Ventas del mes anterior
                $startPrev = $start->copy()->subMonth()->startOfMonth();
                $endPrev = $start->copy()->subMonth()->endOfMonth();

                $salesPrevMonth = Sale::with(['product.category'])
                    ->where('user_id', $user->id)
                    ->whereBetween('sale_date', [$startPrev, $endPrev])
                    ->get();
            }

            // Si month es total, $salesPrevMonth se queda null
            $sales = $query->get();

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
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los datos.'
            ], 500);
        }
    }
}
