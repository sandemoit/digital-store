<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PaymentMethod;
use Illuminate\Support\Facades\DB;

class PaymentMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Nonaktifkan sementara constraint foreign key
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        PaymentMethod::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $methods = [
            // Bank Transfer Manual
            [
                'code' => 'bri',
                'name' => 'Bank BRI',
                'type' => 'bank_transfer',
                'method' => 'manual',
                'fee' => 0,
                'account_number' => '1234567890',
                'account_name' => 'Sandi Maulidika',
                'instructions' => 'Silakan transfer ke rekening BRI atas nama Sandi Maulidika',
                'is_active' => true
            ],
            [
                'code' => 'bca',
                'name' => 'Bank BCA',
                'type' => 'bank_transfer',
                'method' => 'manual',
                'fee' => 0,
                'account_number' => '0987654321',
                'account_name' => 'Sandi Maulidika',
                'instructions' => 'Silakan transfer ke rekening BCA atas nama Sandi Maulidika',
                'is_active' => true
            ],

            // Virtual Account (Otomatis)
            [
                'code' => 'bri_va',
                'name' => 'BRI Virtual Account',
                'type' => 'virtual_account',
                'method' => 'automatic',
                'fee' => 2500,
                'instructions' => 'Pembayaran melalui Virtual Account BRI',
                'is_active' => true
            ],
            [
                'code' => 'bca_va',
                'name' => 'BCA Virtual Account',
                'type' => 'virtual_account',
                'method' => 'automatic',
                'fee' => 2500,
                'instructions' => 'Pembayaran melalui Virtual Account BCA',
                'is_active' => true
            ],

            // E-Wallet (Otomatis)
            [
                'code' => 'gopay',
                'name' => 'GoPay',
                'type' => 'e_wallet',
                'method' => 'automatic',
                'fee' => 1500,
                'instructions' => 'Pembayaran melalui GoPay',
                'is_active' => true
            ],
            [
                'code' => 'shopeepay',
                'name' => 'ShopeePay',
                'type' => 'e_wallet',
                'method' => 'automatic',
                'fee' => 1500,
                'instructions' => 'Pembayaran melalui ShopeePay',
                'is_active' => true
            ],

            // QRIS (Otomatis)
            [
                'code' => 'qris',
                'name' => 'QRIS',
                'type' => 'qris',
                'method' => 'automatic',
                'fee' => 1000,
                'instructions' => 'Scan QR Code untuk pembayaran',
                'is_active' => true
            ],

            // Retail Outlet (Otomatis)
            [
                'code' => 'alfamart',
                'name' => 'Alfamart',
                'type' => 'retail_outlet',
                'method' => 'automatic',
                'fee' => 3000,
                'instructions' => 'Bayar di gerai Alfamart terdekat',
                'is_active' => true
            ],
            [
                'code' => 'indomaret',
                'name' => 'Indomaret',
                'type' => 'retail_outlet',
                'method' => 'automatic',
                'fee' => 3000,
                'instructions' => 'Bayar di gerai Indomaret terdekat',
                'is_active' => true
            ]
        ];

        foreach ($methods as $method) {
            PaymentMethod::create($method);
        }

        $this->command->info('Payment methods seeded successfully!');
    }
}
