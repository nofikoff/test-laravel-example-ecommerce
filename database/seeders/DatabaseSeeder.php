<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Create 10 products with normal stock (10-100)
        Product::factory(10)->create();

        // Create 5 products with low stock (1-4)
        Product::factory(5)->lowStock()->create();

        // Create 5 products that are out of stock
        Product::factory(5)->outOfStock()->create();
    }
}
