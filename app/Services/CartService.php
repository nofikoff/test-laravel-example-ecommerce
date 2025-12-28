<?php

namespace App\Services;

use App\Exceptions\InsufficientStockException;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;

/**
 * Service for managing shopping cart operations.
 */
class CartService
{
    /**
     * Get the user's cart or create a new one.
     *
     * @param  User  $user
     * @return Cart
     */
    public function getOrCreateCart(User $user): Cart
    {
        return $user->cart ?? Cart::create(['user_id' => $user->id]);
    }

    /**
     * Add a product to the user's cart.
     *
     * @param  User  $user
     * @param  Product  $product
     * @param  int  $quantity
     * @return CartItem
     *
     * @throws InsufficientStockException
     */
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

    /**
     * Update the quantity of a cart item.
     *
     * @param  CartItem  $cartItem
     * @param  int  $quantity
     * @return CartItem
     *
     * @throws InsufficientStockException
     */
    public function updateItemQuantity(CartItem $cartItem, int $quantity): CartItem
    {
        if ($cartItem->product->stock_quantity < $quantity) {
            throw new InsufficientStockException($cartItem->product, $quantity);
        }

        $cartItem->update(['quantity' => $quantity]);

        return $cartItem->fresh(['product']);
    }

    /**
     * Remove an item from the cart.
     *
     * @param  CartItem  $cartItem
     * @return void
     */
    public function removeItem(CartItem $cartItem): void
    {
        $cartItem->delete();
    }

    /**
     * Get the user's cart with all items and products loaded.
     *
     * @param  User  $user
     * @return Cart|null
     */
    public function getCartWithItems(User $user): ?Cart
    {
        return $user->cart()->with('items.product')->first();
    }

    /**
     * Remove all items from the cart.
     *
     * @param  Cart  $cart
     * @return void
     */
    public function clearCart(Cart $cart): void
    {
        $cart->items()->delete();
    }

    /**
     * Calculate the total price of all items in the cart.
     *
     * @param  Cart  $cart
     * @return float
     */
    public function getCartTotal(Cart $cart): float
    {
        return $cart->items->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });
    }

    /**
     * Get the total quantity of items in the user's cart.
     *
     * @param  User  $user
     * @return int
     */
    public function getCartItemCount(User $user): int
    {
        $cart = $user->cart;

        if (!$cart) {
            return 0;
        }

        return $cart->items()->sum('quantity');
    }
}
