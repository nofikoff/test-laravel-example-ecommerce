<x-mail::message>
# {{ __('emails.order_confirmation.greeting', ['name' => $user->name]) }}

{{ __('emails.order_confirmation.intro', ['id' => $order->id]) }}

<x-mail::table>
| {{ __('emails.order_confirmation.product') }} | {{ __('emails.order_confirmation.quantity') }} | {{ __('emails.order_confirmation.price') }} | {{ __('emails.order_confirmation.subtotal') }} |
|:----------------------------------------------|:----------------------------------------------:|:-------------------------------------------:|:----------------------------------------------:|
@foreach($order->items as $item)
| {{ $item->product->name }} | {{ $item->quantity }} | ${{ number_format($item->price, 2) }} | ${{ number_format($item->subtotal, 2) }} |
@endforeach
</x-mail::table>

**{{ __('emails.order_confirmation.total') }}: ${{ number_format($order->total_amount, 2) }}**

{{ __('emails.order_confirmation.thanks') }}

{{ __('emails.order_confirmation.regards') }},<br>
{{ config('app.name') }}
</x-mail::message>
