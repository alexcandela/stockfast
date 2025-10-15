<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    // Obtener todos los lotes y productos de un usuario
    public function getProducts()
    {
        try {
            $user = Auth::user();
            $products = Product::with('purchase', 'category')
                ->whereHas('purchase', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->get();

            return response()->json([
                'success' => true,
                'products' => $products
            ]);
        } catch (\Throwable $th) {
            //throw $th;
            Log::error('Error en getProducts@ProductController', ['exception' => $th->getMessage()]);
        }
    }
}
