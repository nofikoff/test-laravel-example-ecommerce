<?php

namespace App\Exceptions;

use App\Models\Product;
use Exception;

class InsufficientStockException extends Exception
{
    public function __construct(
        public readonly Product $product,
        public readonly int $requestedQuantity
    ) {
        parent::__construct(
            "Insufficient stock for product '{$product->name}'. " .
            "Requested: {$requestedQuantity}, Available: {$product->stock_quantity}"
        );
    }
}
