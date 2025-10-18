<?php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

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
    }
}
