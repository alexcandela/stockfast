<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductionSeeder extends Seeder
{
    public function run()
    {
        // Insertar categorías si no existen
        $categories = [
            'Electrónica',
            'Ropa',
            'Calzado',
            'Juguetes',
            'Accesorios',
            'Joyas',
            'Relojes',
        ];

        foreach ($categories as $name) {
            DB::table('categories')->updateOrInsert(
                ['name' => $name],
                ['created_at' => now(), 'updated_at' => now()]
            );
        }

        // Insertar planes mínimos
        DB::table('plans')->updateOrInsert(
            ['name' => 'Free'],
            ['price' => 0, 'duration_days' => 9999, 'created_at' => now(), 'updated_at' => now()]
        );

        DB::table('plans')->updateOrInsert(
            ['name' => 'Pro'],
            ['price' => 9.99, 'duration_days' => 30, 'created_at' => now(), 'updated_at' => now()]
        );
    }
}
