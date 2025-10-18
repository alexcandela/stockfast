<?php

namespace App\Http\Controllers;

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

        // Calcular % variación respecto al mes anterior
        if ($salesPrevMonth) {
            $prevNetos = 0;
            foreach ($salesPrevMonth as $sale) {
                $quantity = $sale->quantity ?? 1;
                $productCost = optional($sale->product)->purchase_price ?? 0;
                $prevNetos += ($sale->sale_price - $productCost) * $quantity;
            }

            $ingresos['variacion_mes'] = $prevNetos > 0
                ? round((($netos - $prevNetos) / $prevNetos) * 100, 2)
                : null; // si el mes anterior es 0
        } else {
            $ingresos['variacion_mes'] = null;
        }
        return $ingresos;
    }




    public function getGeneralData(Request $request)
    {
        $user = Auth::user();
        $month = $request->query('month'); // formato YYYY-MM, null o 'total'
        $plan = $user->plan->name ?? 'Free';

        try {
            $query = Sale::with(['product.category'])
                ->where('user_id', $user->id);

            $salesPrevMonth = null; // inicializamos

            if ($month && $month !== 'total') {
                $start = Carbon::parse($month . '-01')->startOfMonth();
                $end = Carbon::parse($month . '-01')->endOfMonth();

                // Si el usuario es Free, solo puede ver mes actual o anterior
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

                // Ventas del mes anterior para calcular variación
                $startPrev = $start->copy()->subMonth()->startOfMonth();
                $endPrev = $start->copy()->subMonth()->endOfMonth();

                $salesPrevMonth = Sale::with(['product.category'])
                    ->where('user_id', $user->id)
                    ->whereBetween('sale_date', [$startPrev, $endPrev])
                    ->get();
            }

            $sales = $query->get();
            $ingresos = $this->calcularIngresos($sales, $salesPrevMonth);

            return response()->json([
                'success' => true,
                'data' => $sales,
                'ingresos' => $ingresos
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
