<?php

namespace App\Http\Controllers;

use App\Exceptions\InsufficientStockException;
use App\Services\CheckoutService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    public function __construct(
        private readonly CheckoutService $checkoutService
    ) {}

    public function store(Request $request): RedirectResponse
    {
        try {
            $order = $this->checkoutService->processCheckout($request->user());

            return redirect()->route('dashboard')
                ->with('success', "Order #{$order->id} placed successfully! Total: $" . number_format($order->total_amount, 2));
        } catch (InsufficientStockException $e) {
            return back()->withErrors(['checkout' => $e->getMessage()]);
        } catch (\Exception $e) {
            return back()->withErrors(['checkout' => $e->getMessage()]);
        }
    }
}
