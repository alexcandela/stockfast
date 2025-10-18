<?php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\User;
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

        // Datos ficticios de lotes, productos y ventas
        $faker = Faker::create();

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

            // Crear productos asociados a esta compra
            for ($j = 1; $j <= rand(1, 5); $j++) {
                DB::table('products')->insert([
                    'purchase_id' => $purchaseId,
                    'category_id' => rand(1, 7),
                    'name' => ucfirst($faker->words(rand(1, 3), true)),
                    'description' => $faker->sentence,
                    'purchase_price' => $faker->randomFloat(2, 10, 200),
                    'estimated_sale_price' => $faker->randomFloat(2, 20, 400),
                    'quantity' => rand(1, 10),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $products = DB::table('products')->get();

        foreach ($products as $product) {
            // Generar ventas aleatorias por producto
            for ($i = 1; $i <= rand(0, $product->quantity); $i++) {
                DB::table('sales')->insert([
                    'user_id' => 1,
                    'product_id' => $product->id,
                    'sale_price' => $product->estimated_sale_price,
                    'sale_date' => $faker->dateTimeThisYear,
                    'quantity' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

    }
}
