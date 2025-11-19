<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    /**
     * Obtener todos los productos de un usuario
     */
    public function getProducts()
    {
        try {
            $user = Auth::user();

            $products = Product::with(['purchase', 'category'])
                ->whereHas('purchase', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->where('quantity', '>=', 1)
                ->orderBy('updated_at', 'desc')
                ->get();

            $productsFormatted = $products->map(function ($product) {
                return $this->formatProduct($product);
            });

            return response()->json([
                'success' => true,
                'products' => $productsFormatted
            ], 200);
        } catch (\Throwable $th) {
            return $this->handleError($th, 'Error al obtener los productos.');
        }
    }

    /**
     * Obtener un producto específico
     */
    public function getProduct($id)
    {
        try {
            $user = Auth::user();

            $product = Product::with(['purchase', 'category'])
                ->whereHas('purchase', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'product' => $this->formatProduct($product)
            ], 200);
        } catch (\Throwable $th) {
            return $this->handleError($th, 'Error al obtener el producto.');
        }
    }

    /**
     * Eliminar un producto
     */
    public function deleteProduct($id)
    {
        try {
            $user = Auth::user();

            $product = $this->findUserProduct($user, $id);

            if ($product->sales()->exists()) {
                return $this->setProductQuantityToZero($product);
            }

            $product->delete();

            return response()->json([
                'success' => true,
                'message' => 'Producto eliminado correctamente.'
            ], 200);
        } catch (\Throwable $th) {
            return $this->handleError($th, 'Error al eliminar el producto.');
        }
    }

    public function updateProduct(UpdateProductRequest $request, $id)
    {
        try {
            $user = Auth::user();

            $product = $this->findUserProduct($user, $id);

            $validatedData = $request->validated();

            $product->update($validatedData);

            return response()->json([
                'success' => true,
                'message' => 'Producto actualizado correctamente.',
                'product' => $this->formatProduct($product)
            ], 200);
        } catch (\Throwable $th) {
            return $this->handleError($th, 'Error al actualizar el producto.');
        }
    }

    /**
     * Formatear producto según la interfaz TypeScript
     */
    private function formatProduct($product): array
    {
        $proportionalShipping = $this->calculateProportionalShipping($product);

        return [
            'id' => $product->id,
            'name' => $product->name,
            'quantity' => $product->quantity,
            'purchase_price' => $product->purchase_price,
            'shipping_cost' => $proportionalShipping,
            'estimated_sale_price' => $product->estimated_sale_price,
            'category_id' => $product->category_id,
            'description' => $product->description,
            'purchase' => $product->purchase,
            'category' => $product->category,
        ];
    }

    /**
     * Calcular el envío proporcional para un producto (por unidad)
     */
    private function calculateProportionalShipping($product): float
    {
        $shippingCost = $product->purchase->shipping_cost ?? 0;

        if ($shippingCost == 0) {
            return 0;
        }

        // Calcular la cantidad total de productos en la compra
        $totalQuantity = $this->calculateTotalQuantity($product->purchase);

        if ($totalQuantity == 0) {
            return 0;
        }

        // Dividir el costo de envío entre todas las unidades
        $shippingPerUnit = $shippingCost / $totalQuantity;

        return round($shippingPerUnit, 2);
    }

    /**
     * Calcular la cantidad total de productos en la compra
     */
    private function calculateTotalQuantity($purchase): int
    {
        return $purchase->products->sum('quantity');
    }

    /**
     * Buscar un producto que pertenezca al usuario
     */
    private function findUserProduct($user, $productId)
    {
        return Product::where('id', $productId)
            ->whereHas('purchase', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->firstOrFail();
    }

    /**
     * Establecer cantidad a 0 cuando tiene ventas
     */
    private function setProductQuantityToZero($product)
    {
        $product->quantity = 0;
        $product->save();

        return response()->json([
            'success' => true,
            'message' => 'El producto tiene ventas registradas, su cantidad se ha establecido en 0.',
        ], 200);
    }

    /**
     * Manejar errores
     */
    private function handleError(\Throwable $exception, string $message)
    {
        Log::error($message, [
            'exception' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString()
        ]);

        return response()->json([
            'success' => false,
            'message' => $message
        ], 500);
    }
}
