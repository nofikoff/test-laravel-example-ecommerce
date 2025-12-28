<?php

namespace App\Exceptions;

use App\Models\Product;
use Exception;

/**
 * Exception thrown when requested quantity exceeds available stock.
 */
class InsufficientStockException extends Exception
{
    /**
     * Create a new exception instance.
     *
     * @param  Product  $product  The product with insufficient stock
     * @param  int  $requestedQuantity  The quantity that was requested
     */
    public function __construct(
        public Product $product,
        public int $requestedQuantity
    ) {
        parent::__construct(
            "Insufficient stock for product '{$product->name}'. " .
            "Requested: {$requestedQuantity}, Available: {$product->stock_quantity}"
        );
    }
}
