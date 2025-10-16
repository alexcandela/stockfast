<?php

namespace App\Http\Controllers;

use App\Http\Requests\SaleRequest;
use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

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

        if ($newQuantity === 0) {
            $product->quantity = 0;
        } else {
            $product->quantity = $newQuantity;
        }

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
}
