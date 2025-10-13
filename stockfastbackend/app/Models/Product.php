<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{

    protected $fillable = [
        'name',
        'quantity',
        'purchase_price',
        'estimated_sale_price',
        'category_id',
        'description',
        'purchase_id'
    ];

    protected $casts = [
        'purchase_price' => 'decimal:2',
        'estimated_sale_price' => 'decimal:2',
    ];


    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    public function purchase()
    {
        return $this->belongsTo(Purchase::class);
    }
    public function sales()
    {
        return $this->hasMany(Sale::class);
    }
}
