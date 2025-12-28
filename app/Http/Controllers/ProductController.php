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

        $cart = $this->cartService->getCartWithItems($request->user());
        $cartItemCount = $this->cartService->getCartItemCount($request->user());

        return Inertia::render('Dashboard', [
            'products' => $products,
            'cart' => $cart,
            'cartItemCount' => $cartItemCount,
        ]);
    }
}
