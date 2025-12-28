<?php

namespace App\Services;

use App\Events\OrderPlaced;
use App\Exceptions\InsufficientStockException;
use App\Jobs\SendLowStockAlertJob;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CheckoutService
{
    public function __construct(
        private readonly CartService $cartService
    ) {}

    /**
     * Process checkout: validate stock, create order, decrement inventory, dispatch alerts.
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
                $product = Product::lockForUpdate()->find($item->product_id);

                if ($product->stock_quantity < $item->quantity) {
                    throw new InsufficientStockException($product, $item->quantity);
                }

                $itemTotal = $product->price * $item->quantity;
                $totalAmount += $itemTotal;

                $orderItems[] = [
                    'product_id' => $product->id,
                    'quantity' => $item->quantity,
                    'price' => $product->price,
                ];

                $product->decrement('stock_quantity', $item->quantity);

                if ($product->fresh()->isLowStock()) {
                    $lowStockProducts[] = $product->fresh();
                }
            }

            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $totalAmount,
            ]);

            foreach ($orderItems as $orderItemData) {
                $order->items()->create($orderItemData);
            }

            $this->cartService->clearCart($cart);

            foreach ($lowStockProducts as $product) {
                SendLowStockAlertJob::dispatch($product);
            }

            event(new OrderPlaced($order));

            return $order->load('items.product');
        });
    }
}
