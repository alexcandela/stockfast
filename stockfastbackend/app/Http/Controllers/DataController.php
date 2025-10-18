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
    public function getGeneralData(Request $request)
    {
        $user = Auth::user();
        $month = $request->query('month'); // formato YYYY-MM o null

        try {
            $query = Sale::with(['product.category'])
                ->where('user_id', $user->id);

            if ($month) {
                // Filtrar por mes
                $start = Carbon::parse($month . '-01')->startOfMonth();
                $end = Carbon::parse($month . '-01')->endOfMonth();
                $query->whereBetween('sale_date', [$start, $end]);
            }

            $sales = $query->get();

            return response()->json([
                'success' => true,
                'data' => $sales
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
