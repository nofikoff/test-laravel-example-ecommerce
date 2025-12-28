<?php

namespace Tests\Feature;

use App\Events\OrderPlaced;
use App\Jobs\SendLowStockAlertJob;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_checkout_creates_order_and_decreases_stock(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'stock_quantity' => 10,
            'price' => 25.00,
        ]);

        $cart = Cart::create(['user_id' => $user->id]);
        CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 3,
        ]);

        $response = $this->actingAs($user)->post(route('checkout.store'));

        $response->assertRedirect();

        // Assert order created
        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'total_amount' => 75.00,
        ]);

        // Assert order items created
        $this->assertDatabaseHas('order_items', [
            'product_id' => $product->id,
            'quantity' => 3,
            'price' => 25.00,
        ]);

        // Assert stock decreased
        $this->assertEquals(7, $product->fresh()->stock_quantity);

        // Assert cart cleared
        $this->assertDatabaseMissing('cart_items', [
            'cart_id' => $cart->id,
        ]);
    }

    public function test_checkout_fails_with_empty_cart(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('checkout.store'));

        $response->assertSessionHasErrors('checkout');
    }

    public function test_checkout_fails_if_insufficient_stock(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'stock_quantity' => 2,
            'price' => 25.00,
        ]);

        $cart = Cart::create(['user_id' => $user->id]);
        CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 5,
        ]);

        $response = $this->actingAs($user)->post(route('checkout.store'));

        $response->assertSessionHasErrors('checkout');

        // Assert no order created
        $this->assertDatabaseMissing('orders', [
            'user_id' => $user->id,
        ]);

        // Assert stock unchanged
        $this->assertEquals(2, $product->fresh()->stock_quantity);
    }

    public function test_order_placed_event_is_dispatched(): void
    {
        Event::fake([OrderPlaced::class]);

        $user = User::factory()->create();
        $product = Product::factory()->create(['stock_quantity' => 10]);

        $cart = Cart::create(['user_id' => $user->id]);
        CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $this->actingAs($user)->post(route('checkout.store'));

        Event::assertDispatched(OrderPlaced::class);
    }

    public function test_low_stock_alert_job_is_dispatched_when_stock_below_5(): void
    {
        Queue::fake();

        $user = User::factory()->create();
        $product = Product::factory()->create([
            'stock_quantity' => 6,
            'price' => 25.00,
        ]);

        $cart = Cart::create(['user_id' => $user->id]);
        CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 3,
        ]);

        $this->actingAs($user)->post(route('checkout.store'));

        // Stock is now 3, which is below 5
        Queue::assertPushed(SendLowStockAlertJob::class);
    }

    public function test_low_stock_alert_not_dispatched_when_stock_above_5(): void
    {
        Queue::fake();

        $user = User::factory()->create();
        $product = Product::factory()->create([
            'stock_quantity' => 20,
            'price' => 25.00,
        ]);

        $cart = Cart::create(['user_id' => $user->id]);
        CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 5,
        ]);

        $this->actingAs($user)->post(route('checkout.store'));

        // Stock is now 15, which is above 5
        Queue::assertNotPushed(SendLowStockAlertJob::class);
    }

    public function test_checkout_handles_multiple_products(): void
    {
        $user = User::factory()->create();
        $product1 = Product::factory()->create([
            'stock_quantity' => 10,
            'price' => 20.00,
        ]);
        $product2 = Product::factory()->create([
            'stock_quantity' => 15,
            'price' => 30.00,
        ]);

        $cart = Cart::create(['user_id' => $user->id]);
        CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product1->id,
            'quantity' => 2,
        ]);
        CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product2->id,
            'quantity' => 3,
        ]);

        $this->actingAs($user)->post(route('checkout.store'));

        // Total: (20 * 2) + (30 * 3) = 40 + 90 = 130
        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'total_amount' => 130.00,
        ]);

        $this->assertEquals(8, $product1->fresh()->stock_quantity);
        $this->assertEquals(12, $product2->fresh()->stock_quantity);
    }
}
