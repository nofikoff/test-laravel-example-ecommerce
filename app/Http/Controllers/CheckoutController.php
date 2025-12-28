<?php

namespace App\Http\Controllers;

use App\Exceptions\InsufficientStockException;
use App\Services\CheckoutService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

/**
 * Handles checkout and order creation.
 */
class CheckoutController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @param  CheckoutService  $checkoutService
     */
    public function __construct(
        private CheckoutService $checkoutService
    ) {}

    /**
     * Process the checkout and create an order.
     *
     * @param  Request  $request
     * @return RedirectResponse
     */
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
