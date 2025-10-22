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
                ->where('quantity', '>=', 1)
                ->orderBy('updated_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'products' => $products
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Error en getProducts@ProductController', [
                'exception' => $th->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los productos.'
            ], 500);
        }
    }

    // Eliminar un producto
    public function deleteProduct($id)
    {
        try {
            $user = Auth::user();

            $product = Product::where('id', $id)
                ->whereHas('purchase', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->firstOrFail();

            // Si el producto tiene ventas asociadas
            if ($product->sales()->exists()) {
                $product->quantity = 0;
                $product->save();

                return response()->json([
                    'success' => true,
                    'message' => 'El producto tiene ventas registradas, su cantidad se ha establecido en 0.',
                ], 200);
            }

            $product->delete();

            return response()->json([
                'success' => true,
                'message' => 'Producto eliminado correctamente.'
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Error en deleteProduct@ProductController', [
                'exception' => $th->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el producto.'
            ], 500);
        }
    }
}
