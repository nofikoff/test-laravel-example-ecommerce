<x-mail::message>
# {{ __('emails.daily_report.title') }}

**{{ __('emails.daily_report.date') }}** {{ $date }}

## {{ __('emails.daily_report.summary') }}

<x-mail::table>
| {{ __('emails.daily_report.metric') }} | {{ __('emails.daily_report.value') }} |
|:-------|------:|
| {{ __('emails.daily_report.total_orders') }} | {{ $totalOrders }} |
| {{ __('emails.daily_report.total_revenue') }} | ${{ number_format($totalRevenue, 2) }} |
</x-mail::table>

@if($orders->count() > 0)
## {{ __('emails.daily_report.orders') }}

<x-mail::table>
| {{ __('emails.daily_report.order_id') }} | {{ __('emails.daily_report.customer') }} | {{ __('emails.daily_report.total') }} |
|:---------|:---------|------:|
@foreach($orders as $order)
| #{{ $order->id }} | {{ $order->user->name }} | ${{ number_format($order->total_amount, 2) }} |
@endforeach
</x-mail::table>
@else
{{ __('emails.daily_report.no_orders') }}
@endif

{{ __('emails.thanks') }}<br>
{{ config('app.name') }}
</x-mail::message>
