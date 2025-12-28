<x-mail::message>
# Daily Sales Report

**Date:** {{ $date }}

## Summary

<x-mail::table>
| Metric | Value |
|:-------|------:|
| Total Orders | {{ $totalOrders }} |
| Total Revenue | ${{ number_format($totalRevenue, 2) }} |
</x-mail::table>

@if($orders->count() > 0)
## Orders

<x-mail::table>
| Order ID | Customer | Total |
|:---------|:---------|------:|
@foreach($orders as $order)
| #{{ $order->id }} | {{ $order->user->name }} | ${{ number_format($order->total_amount, 2) }} |
@endforeach
</x-mail::table>
@else
No orders were placed today.
@endif

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
