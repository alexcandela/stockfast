<?php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\User;
use Carbon\Carbon;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 🔹 Crear categorías
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

        // Crear planes
        DB::table('plans')->insertOrIgnore([
            ['name' => 'Free', 'price' => 0, 'duration_days' => 9999],
            ['name' => 'Pro', 'price' => 9.99, 'duration_days' => 30],
        ]);


        // 🔹 Crear un usuario
        DB::table('users')->updateOrInsert(
            [
                'email' => 'candelalex22@gmail.com',
                'username' => 'candela',
                'name' => 'Alex',
                'last_name' => 'Candela',
                'email_verified_at' => now(),
                'password' => Hash::make('123'),
                'plan_id' => 1,
                'plan_expires_at' => now()->addDays(30),
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        DB::table('users')->updateOrInsert(
            [
                'email' => 'alex.candelaa@gmail.com',
                'username' => 'alexcandelaa',
                'name' => 'Alex',
                'last_name' => 'Candela',
                'email_verified_at' => now(),
                'password' => Hash::make('123'),
                'plan_id' => 2,
                'plan_expires_at' => now()->addDays(30),
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        $faker = Faker::create();

        // Crear compras y productos
        for ($i = 1; $i <= 10; $i++) {
            $purchaseId = DB::table('purchases')->insertGetId([
                'user_id' => 1,
                'shipping_cost' => $faker->randomFloat(2, 5, 20),
                'supplier_name' => $faker->company,
                'shipping_agency' => $faker->company,
                'purchase_date' => $faker->dateTimeThisYear,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Crear productos asociados a la compra
            for ($j = 1; $j <= rand(1, 5); $j++) {
                // Precio de compra entre 5 y 30
                $purchasePrice = $faker->randomFloat(2, 5, 30);
                // Precio de venta entre compra+0,01 y máximo 150 (y nunca menor que compra)
                $maxSalePrice = min($purchasePrice + 150, 150);
                $salePrice = $faker->randomFloat(2, $purchasePrice + 0.01, $maxSalePrice);

                DB::table('products')->insert([
                    'purchase_id' => $purchaseId,
                    'category_id' => rand(1, 7),
                    'name' => ucfirst($faker->words(rand(1, 3), true)),
                    'description' => $faker->sentence,
                    'purchase_price' => $purchasePrice,
                    'estimated_sale_price' => $salePrice,
                    'quantity' => rand(1, 10),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $products = DB::table('products')->get();

        // Generar ventas distribuidas durante el año
        $startDate = Carbon::now()->startOfYear();
        $endDate = Carbon::now()->endOfYear();

        for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
            $numSalesToday = rand(2, 10); // entre 2 y 10 ventas por día

            for ($i = 0; $i < $numSalesToday; $i++) {
                $product = $products->random();

                // El precio de venta siempre por encima del de compra, hasta un máximo de 150
                $salePrice = min($product->estimated_sale_price, 150);
                if ($salePrice <= $product->purchase_price) {
                    // Si por algún motivo el precio estimado es inferior o igual al de compra, generamos uno válido
                    $salePrice = $product->purchase_price + $faker->randomFloat(2, 0.01, (150 - $product->purchase_price));
                }

                DB::table('sales')->insert([
                    'user_id' => 1,
                    'product_id' => $product->id,
                    'sale_price' => $salePrice,
                    'sale_date' => $date->copy()->setTime(rand(8, 22), rand(0, 59), rand(0, 59)),
                    'quantity' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
