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

        if (app()->environment('production')) {
            $this->call(ProductionSeeder::class);
        }
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

        // Listas de nombres específicos por categoría
        $realNames = [
            1 => [ // Electrónica
                'iPhone 13 Pro',
                'iPhone 14',
                'Samsung Galaxy S23 Ultra',
                'iPad Air',
                'MacBook Pro M2',
                'AirPods Pro 2',
                'Sony WH-1000XM5',
                'PlayStation 5',
                'Nintendo Switch OLED',
                'Apple Watch Series 8',
                'GoPro Hero 11',
                'Canon EOS R6'
            ],
            2 => [ // Ropa
                'Camiseta Supreme Box Logo',
                'Sudadera Nike Tech Fleece',
                'Chaqueta The North Face Nuptse',
                'Polo Ralph Lauren',
                'Camiseta Burberry Check',
                'Pantalones Carhartt',
                'Vestido Zara Studio',
                'Camisa Tommy Hilfiger',
                'Sudadera Adidas Originals',
                'Chaqueta Moncler',
                'Jersey Stone Island',
                'Pantalones Dickies 874'
            ],
            3 => [ // Calzado
                'Nike Air Max 90',
                'Air Jordan 1 Retro High',
                'Adidas Yeezy Boost 350',
                'New Balance 550',
                'Nike Dunk Low Panda',
                'Adidas Samba',
                'Nike Air Force 1',
                'Converse Chuck Taylor',
                'Vans Old Skool',
                'Salomon XT-6',
                'Asics Gel-Kayano 14',
                'New Balance 2002R'
            ],
            4 => [ // Juguetes
                'LEGO Star Wars Millennium Falcon',
                'PlayStation 5 Controller',
                'Nintendo Switch Pro Controller',
                'Funko Pop Exclusivo',
                'Hot Wheels Premium',
                'Barbie Collector Edition',
                'LEGO Technic Bugatti',
                'Magic: The Gathering Booster',
                'Pokémon Trading Cards',
                'Nerf Elite 2.0'
            ],
            5 => [ // Accesorios
                'Gafas Ray-Ban Aviator',
                'Cinturón Louis Vuitton',
                'Bufanda Burberry Check',
                'Gorra New Era 59FIFTY',
                'Bolso Michael Kors',
                'Mochila Fjällräven Kånken',
                'Cartera Prada Saffiano',
                'Gafas Oakley Holbrook',
                'Riñonera Nike Heritage'
            ],
            6 => [ // Joyas
                'Anillo Pandora',
                'Collar Tiffany & Co.',
                'Pulsera Cartier Love',
                'Pendientes Swarovski',
                'Anillo Tous',
                'Collar Van Cleef & Arpels',
                'Pulsera Bulgari Serpenti'
            ],
            7 => [ // Relojes
                'Rolex Submariner',
                'Casio G-Shock',
                'Apple Watch Ultra',
                'Seiko 5 Sports',
                'Omega Seamaster',
                'TAG Heuer Carrera',
                'Citizen Eco-Drive',
                'Samsung Galaxy Watch 5'
            ],
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

        // 🔹 Crear usuarios
        DB::table('users')->updateOrInsert(
            ['email' => 'candelalex22@gmail.com'],
            [
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
            ['email' => 'alex.candelaa@gmail.com'],
            [
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

        for ($i = 1; $i <= 10; $i++) {
            $shippingCost = $faker->randomFloat(2, 5, 20);

            $purchaseId = DB::table('purchases')->insertGetId([
                'user_id' => 1,
                'shipping_cost' => $shippingCost,
                'supplier_name' => $faker->company,
                'shipping_agency' => $faker->company,
                'purchase_date' => $faker->dateTimeThisYear,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Primero generar los productos con sus cantidades
            $numProducts = rand(1, 5);
            $productsData = [];

            for ($j = 0; $j < $numProducts; $j++) {
                $category_id = rand(1, 7);
                $productName = $realNames[$category_id][array_rand($realNames[$category_id])];
                $purchasePrice = $faker->randomFloat(2, 5, 30);
                $maxSalePrice = min($purchasePrice + 150, 150);
                $salePrice = $faker->randomFloat(2, $purchasePrice + 0.01, $maxSalePrice);

                $productsData[] = [
                    'purchase_id' => $purchaseId,
                    'category_id' => $category_id,
                    'name' => $productName,
                    'description' => $faker->sentence,
                    'purchase_price' => $purchasePrice,
                    'estimated_sale_price' => $salePrice,
                    'quantity' => rand(1, 10),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // Calcular el total de unidades y el proporcional
            $totalQuantity = array_sum(array_column($productsData, 'quantity'));
            $shippingPerUnit = $totalQuantity > 0 ? round($shippingCost / $totalQuantity, 2) : 0;

            // Añadir el shipping_cost_per_unit a cada producto e insertar
            foreach ($productsData as $product) {
                $product['shipping_cost_per_unit'] = $shippingPerUnit;
                DB::table('products')->insert($product);
            }
        }

        $products = DB::table('products')->get();

        // Generar ventas distribuidas por mes durante el año
        $startDate = Carbon::now()->startOfYear();
        $endDate = Carbon::now()->endOfYear();

        // Iterar por cada mes del año
        for ($month = 1; $month <= 12; $month++) {
            $monthStart = Carbon::create($startDate->year, $month, 1)->startOfMonth();
            $monthEnd = Carbon::create($startDate->year, $month, 1)->endOfMonth();

            // Número aleatorio de ventas para este mes (entre 5 y 40)
            $numSalesThisMonth = rand(5, 40);

            for ($i = 0; $i < $numSalesThisMonth; $i++) {
                $product = $products->random();

                // El precio de venta siempre por encima del de compra, hasta un máximo de 150
                $salePrice = min($product->estimated_sale_price, 150);
                if ($salePrice <= $product->purchase_price) {
                    $salePrice = $product->purchase_price + $faker->randomFloat(2, 0.01, (150 - $product->purchase_price));
                }

                // Generar una fecha aleatoria dentro del mes
                $randomDate = Carbon::create(
                    $monthStart->year,
                    $monthStart->month,
                    rand(1, $monthEnd->day),
                    rand(8, 22),
                    rand(0, 59),
                    rand(0, 59)
                );

                DB::table('sales')->insert([
                    'user_id' => 1,
                    'product_id' => $product->id,
                    'sale_price' => $salePrice,
                    'sale_date' => $randomDate,
                    'quantity' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
