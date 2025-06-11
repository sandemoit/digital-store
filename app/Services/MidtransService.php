<?php

namespace App\Services;

use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Midtrans\Snap;
use Midtrans\Config;

class MidtransService
{
    public function __construct()
    {
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');
    }

    public function requestTransaksi(Transaksi $transaksi)
    {
        try {
            $params = [
                'transaction_details' => [
                    'order_id' => $transaksi->order_number,
                    'gross_amount' => (int) $transaksi->total_amount,
                ],
                'customer_details' => [
                    'first_name' => $transaksi->user->name,
                    'email' => $transaksi->user->email,
                    'phone' => "08538888888", // Bisa ganti sesuai real data
                ],
                'enabled_payments' => [$transaksi->paymentMethod->code], // Harus array
                // 'callbacks' => [
                //     'finish' => route('transaksi.finish', ['order_id' => $transaksi->order_number]),
                // ],
            ];

            // Dapetin URL buat redirect
            $snap = Snap::getSnapToken($params);
            $redirectUrl = Snap::createTransaction($params)->redirect_url;

            $response = [
                'success' => true,
                'data' => [
                    'checkout_url' => $redirectUrl,
                    'token' => $snap
                ],
            ];

            return $response;
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Gagal menghubungi server pembayaran: ' . $e->getMessage(),
            ];
        }
    }

    public function callback(Request $request)
    {
        $serverKey = config('midtrans.server_key');
        $hashedKey = hash('sha512', $request->order_id . $request->status_code . $request->gross_amount . $serverKey);

        if ($hashedKey !== $request->signature_key) {
            return response()->json(['message' => 'Invalid signature key'], 403);
        }

        $transactionStatus = $request->transaction_status;

        $transaction = Transaksi::with(['paymentMethod', 'items.product', 'user'])
            ->where('order_number', $request->order_number)
            ->firstOrFail();

        switch ($transactionStatus) {
            case 'settlement':
                $transaction->update(['status' => 'completed', 'payment_status' => 'paid']);
                // $this->saveMutationAndBalance($order);
                // $this->sendNotifCallback($order, 'SUCCESS');
                break;
            case 'pending':
                $transaction->update(['status' => 'processing', 'payment_status' => 'pending']);
                break;
            case 'deny':
                $transaction->update(['status' => 'cancelled', 'payment_status' => 'failed']);
                // $this->sendNotifCallback($order, 'failed');
                break;
            case 'expire':
                $transaction->update(['status' => 'cancelled', 'payment_status' => 'failed']);
                // $this->sendNotifCallback($order, 'EXPIRED');
                break;
            case 'cancel':
                $transaction->update(['status' => 'cancelled', 'payment_status' => 'cancelled']);
                // $this->sendNotifCallback($order, 'CANCEL');
                break;
            default:
                $transaction->update(['status' => 'unknown', 'payment_status' => 'unknown']);
                break;
        }

        return response()->json(['status' => 'success', 'message' => 'Callback received successfully']);
    }
}
