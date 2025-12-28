<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        private CartService $cartService
    ) {}

    public function index(Request $request): Response
    {
        $products = Product::orderBy('name')->get();

        $user = $request->user();
        $cart = $user ? $this->cartService->getCartWithItems($user) : null;
        $cartItemCount = $user ? $this->cartService->getCartItemCount($user) : 0;

        return Inertia::render('Dashboard', [
            'products' => $products,
            'cart' => $cart,
            'cartItemCount' => $cartItemCount,
        ]);
    }
}
