<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    public function products()
    {
        return $this->hasMany(Product::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
