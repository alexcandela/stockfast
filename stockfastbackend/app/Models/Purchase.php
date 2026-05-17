<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use PhpParser\Node\Expr\Cast\Object_;

class Purchase extends Model
{

    protected $fillable = [
        'user_id',
        'supplier_name',
        'shipping_agency',
        'shipping_cost',
        'purchase_date',
    ];

    protected $casts = [
        'shipping_cost' => 'decimal:2',
    ];


    public function products()
    {
        return $this->hasMany(Product::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function createWithProducts(array $data, $user): Purchase
    {
        return DB::transaction(function () use ($data, $user) {

            $data['user_id'] = $user->id;

            // Guardar antes de que $data se modifique
            $shippingCost = (float) ($data['shipping_cost'] ?? 0);
            $productsData = $data['products'] ?? [];

            $purchase = self::create($data);

            if (!empty($productsData)) {
                $totalQuantity = array_sum(array_column($productsData, 'quantity'));

                $shippingPerUnit = ($shippingCost > 0 && $totalQuantity > 0)
                    ? round($shippingCost / $totalQuantity, 2)
                    : 0;

                $products = array_map(function ($product) use ($shippingPerUnit) {
                    $product['shipping_cost_per_unit'] = $shippingPerUnit;
                    return $product;
                }, $productsData);

                $purchase->products()->createMany($products);
            }
            return $purchase->load('products');
        });
    }
}
