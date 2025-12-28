<?php

namespace App\Console\Commands;

use App\Mail\DailySalesReport;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendDailySalesReportCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'report:daily-sales';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send the daily sales report email to admin';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $today = Carbon::today();
        $date = $today->format('Y-m-d');

        $orders = Order::with('user')
            ->whereDate('created_at', $today)
            ->get();

        $totalOrders = $orders->count();
        $totalRevenue = $orders->sum('total_amount');

        $this->info("Generating daily sales report for {$date}");
        $this->info("Total orders: {$totalOrders}");
        $this->info("Total revenue: $" . number_format($totalRevenue, 2));

        Mail::to('admin@ecommerce.test')
            ->send(new DailySalesReport(
                date: $date,
                totalOrders: $totalOrders,
                totalRevenue: (float) $totalRevenue,
                orders: $orders
            ));

        $this->info('Daily sales report sent successfully!');

        return Command::SUCCESS;
    }
}
