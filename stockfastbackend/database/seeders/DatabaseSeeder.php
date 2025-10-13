<?php

namespace Database\Seeders;

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

        // 🔹 Crear un usuario
        DB::table('users')->updateOrInsert(
            ['email' => 'usuario@example.com'],
            [
                'username' => 'usuario',
                'name' => 'Nombre',
                'last_name' => 'Apellido',
                'email_verified_at' => now(),
                'password' => Hash::make('123'), // recuerda cambiarlo después
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
