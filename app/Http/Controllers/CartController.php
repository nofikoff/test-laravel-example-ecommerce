<?php

namespace App\Http\Controllers;

use App\Exceptions\InsufficientStockException;
use App\Http\Requests\AddToCartRequest;
use App\Http\Requests\UpdateCartItemRequest;
use App\Http\Resources\CartResource;
use App\Models\CartItem;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(
        private readonly CartService $cartService
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $cart = $this->cartService->getCartWithItems($user);

        return Inertia::render('Cart', [
            'cart' => $cart ? new CartResource($cart) : null,
            'cartItemCount' => $this->cartService->getCartItemCount($user),
        ]);
    }

    public function store(AddToCartRequest $request): RedirectResponse
    {
        $product = Product::findOrFail($request->validated('product_id'));

        try {
            $this->cartService->addItem(
                $request->user(),
                $product,
                $request->validated('quantity', 1)
            );

            return back()->with('success', 'Product added to cart');
        } catch (InsufficientStockException $e) {
            return back()->withErrors(['quantity' => $e->getMessage()]);
        }
    }

    public function update(UpdateCartItemRequest $request, CartItem $cartItem): RedirectResponse
    {
        try {
            $this->cartService->updateItemQuantity($cartItem, $request->validated('quantity'));

            return back()->with('success', 'Cart updated');
        } catch (InsufficientStockException $e) {
            return back()->withErrors(['quantity' => $e->getMessage()]);
        }
    }

    public function destroy(Request $request, CartItem $cartItem): RedirectResponse
    {
        if ($cartItem->cart->user_id !== $request->user()->id) {
            abort(403);
        }

        $this->cartService->removeItem($cartItem);

        return back()->with('success', 'Item removed from cart');
    }
}
