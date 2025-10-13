<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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

    // Si alguno de los inserts falla, se hace un rollback y no se inserta nada que se haya enviado anteriormente
    public static function createWithProducts(array $data): Purchase
    {
        return DB::transaction(function () use ($data) {

            $data['user_id'] = 1;

            $purchase = self::create($data);

            if (!empty($data['products'])) {
                $purchase->products()->createMany($data['products']);
            }

            return $purchase->load('products');
        });
    }
}
