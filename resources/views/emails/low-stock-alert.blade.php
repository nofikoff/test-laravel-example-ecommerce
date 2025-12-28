<x-mail::message>
# {{ __('emails.low_stock.title') }}

{{ __('emails.low_stock.intro') }}

**{{ __('emails.low_stock.product') }}** {{ $product->name }}

**{{ __('emails.low_stock.current_stock') }}** {{ $product->stock_quantity }} {{ __('emails.low_stock.units') }}

**{{ __('emails.low_stock.price') }}** ${{ number_format($product->price, 2) }}

{{ __('emails.low_stock.action') }}

{{ __('emails.thanks') }}<br>
{{ config('app.name') }}
</x-mail::message>
