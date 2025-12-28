<x-mail::message>
# Low Stock Alert

The following product is running low on stock and requires attention:

**Product:** {{ $product->name }}

**Current Stock:** {{ $product->stock_quantity }} units

**Price:** ${{ number_format($product->price, 2) }}

Please restock this product soon to avoid stockouts.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
