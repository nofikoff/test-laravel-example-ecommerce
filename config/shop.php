<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Admin Email
    |--------------------------------------------------------------------------
    |
    | This email address is used for receiving admin notifications such as
    | low stock alerts and daily sales reports.
    |
    */

    'admin_email' => env('ADMIN_EMAIL', 'admin@ecommerce.test'),

    /*
    |--------------------------------------------------------------------------
    | Low Stock Threshold
    |--------------------------------------------------------------------------
    |
    | When a product's stock quantity falls below this threshold after a
    | purchase, a low stock alert will be sent to the admin email.
    |
    */

    'low_stock_threshold' => env('LOW_STOCK_THRESHOLD', 5),

];
