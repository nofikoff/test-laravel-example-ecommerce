<?php

namespace App\Http\Controllers;

use App\Http\Resources\CartResource;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        private readonly CartService $cartService
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();

        $cart = $user ? $this->cartService->getCartWithItems($user) : null;

        return Inertia::render('Dashboard', [
            'products' => ProductResource::collection(Product::ordered()->get()),
            'cart' => $cart ? new CartResource($cart) : null,
            'cartItemCount' => $user ? $this->cartService->getCartItemCount($user) : 0,
        ]);
    }
}
