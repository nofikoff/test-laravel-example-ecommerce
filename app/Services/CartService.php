<?php

namespace App\Services;

use App\Exceptions\InsufficientStockException;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;

class CartService
{
    public function getOrCreateCart(User $user): Cart
    {
        return $user->cart ?? Cart::create(['user_id' => $user->id]);
    }

    /** @throws InsufficientStockException */
    public function addItem(User $user, Product $product, int $quantity = 1): CartItem
    {
        if ($product->stock_quantity < $quantity) {
            throw new InsufficientStockException($product, $quantity);
        }

        $cart = $this->getOrCreateCart($user);
        $cartItem = $cart->items()->where('product_id', $product->id)->first();

        if ($cartItem) {
            $newQuantity = $cartItem->quantity + $quantity;

            if ($product->stock_quantity < $newQuantity) {
                throw new InsufficientStockException($product, $newQuantity);
            }

            $cartItem->update(['quantity' => $newQuantity]);
        } else {
            $cartItem = $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $quantity,
            ]);
        }

        return $cartItem->fresh(['product']);
    }

    /** @throws InsufficientStockException */
    public function updateItemQuantity(CartItem $cartItem, int $quantity): CartItem
    {
        if ($cartItem->product->stock_quantity < $quantity) {
            throw new InsufficientStockException($cartItem->product, $quantity);
        }

        $cartItem->update(['quantity' => $quantity]);

        return $cartItem->fresh(['product']);
    }

    public function removeItem(CartItem $cartItem): void
    {
        $cartItem->delete();
    }

    public function getCartWithItems(User $user): ?Cart
    {
        return $user->cart()->with('items.product')->first();
    }

    public function clearCart(Cart $cart): void
    {
        $cart->items()->delete();
    }

    public function getCartTotal(Cart $cart): float
    {
        return $cart->items->sum(fn (CartItem $item) => $item->subtotal);
    }

    public function getCartItemCount(User $user): int
    {
        return $user->cart?->items()->sum('quantity') ?? 0;
    }
}
