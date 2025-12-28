<?php

namespace App\Console\Commands;

use App\Mail\DailySalesReport;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendDailySalesReportCommand extends Command
{
    protected $signature = 'report:daily-sales';

    protected $description = 'Send the daily sales report email to admin';

    public function handle(): int
    {
        $today = Carbon::today();
        $orders = Order::with('user')->forDate($today)->get();

        $this->info("Generating daily sales report for {$today->format('Y-m-d')}");
        $this->info("Total orders: {$orders->count()}");
        $this->info('Total revenue: $' . number_format($orders->sum('total_amount'), 2));

        Mail::to(config('shop.admin_email'))
            ->send(new DailySalesReport(
                date: $today->format('Y-m-d'),
                totalOrders: $orders->count(),
                totalRevenue: (float) $orders->sum('total_amount'),
                orders: $orders
            ));

        $this->info('Daily sales report sent successfully!');

        return Command::SUCCESS;
    }
}
