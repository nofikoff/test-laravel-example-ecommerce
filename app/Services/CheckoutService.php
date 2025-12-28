<?php

namespace App\Services;

use App\Events\OrderPlaced;
use App\Exceptions\InsufficientStockException;
use App\Jobs\SendLowStockAlertJob;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Service for processing checkout and creating orders.
 */
class CheckoutService
{
    /**
     * Create a new service instance.
     *
     * @param  CartService  $cartService
     */
    public function __construct(
        private CartService $cartService
    ) {}

    /**
     * Process checkout for a user.
     *
     * Creates an order from the user's cart, decrements product stock,
     * dispatches low stock alerts if needed, and clears the cart.
     *
     * @param  User  $user
     * @return Order
     *
     * @throws InsufficientStockException
     * @throws \Exception
     */
    public function processCheckout(User $user): Order
    {
        $cart = $this->cartService->getCartWithItems($user);

        if (!$cart || $cart->items->isEmpty()) {
            throw new \Exception('Cart is empty');
        }

        return DB::transaction(function () use ($user, $cart) {
            $totalAmount = 0;
            $orderItems = [];
            $lowStockProducts = [];

            foreach ($cart->items as $item) {
                // Lock the product row for update to prevent race conditions
                $product = Product::lockForUpdate()->find($item->product_id);

                if ($product->stock_quantity < $item->quantity) {
                    throw new InsufficientStockException($product, $item->quantity);
                }

                // Calculate item total with current price
                $itemTotal = $product->price * $item->quantity;
                $totalAmount += $itemTotal;

                // Prepare order item data
                $orderItems[] = [
                    'product_id' => $product->id,
                    'quantity' => $item->quantity,
                    'price' => $product->price,
                ];

                // Decrement stock
                $product->decrement('stock_quantity', $item->quantity);

                // Check for low stock after decrement
                $freshProduct = $product->fresh();
                if ($freshProduct->stock_quantity < config('shop.low_stock_threshold') && $freshProduct->stock_quantity >= 0) {
                    $lowStockProducts[] = $freshProduct;
                }
            }

            // Create order
            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $totalAmount,
            ]);

            // Create order items
            foreach ($orderItems as $orderItemData) {
                $order->items()->create($orderItemData);
            }

            // Clear the cart
            $this->cartService->clearCart($cart);

            // Dispatch low stock alerts
            foreach ($lowStockProducts as $product) {
                SendLowStockAlertJob::dispatch($product);
            }

            // Fire order placed event
            event(new OrderPlaced($order));

            return $order->load('items.product');
        });
    }
}
