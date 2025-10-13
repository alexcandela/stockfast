<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    // Obtener todos los lotes y productos de un usuario
    public function getProducts() {
        try {
            $purchases = Purchase::with('products')
            ->where('user_id', 1)
            ->get();

            return response()->json([
            'success' => true,
            'products' => $purchases
        ]);
        } catch (\Throwable $th) {
            //throw $th;
            Log::error('Error en getProducts@ProductController', ['exception' => $th->getMessage()]);
        }
    }
}
