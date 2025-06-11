<?php

namespace App\Services;

use App\Helpers\Tripay;
use App\Models\Transaksi;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TripayService
{
    protected $apiKey;
    protected $privateKey;
    protected $merchantCode;
    protected $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('tripay.api_key');
        $this->privateKey = config('tripay.private_key');
        $this->merchantCode = config('tripay.merchant_code');
        $this->baseUrl = config('tripay.base_url');
    }

    public function requestTransaksi(Transaksi $transaksi, $endpoint)
    {
        try {
            $orderItems = collect($transaksi->items)->map(function ($item) {
                return [
                    'name' => $item->product->name,
                    'quantity' => (int) $item->quantity,
                    'price' => (int) $item->price,
                ];
            })->toArray();

            $amount = (int) $transaksi->subtotal;

            $body = [
                'method' => $transaksi->paymentMethod->code,
                'merchant_ref' => $transaksi->order_number,
                'amount' => $amount,
                'customer_name' => $transaksi->user->name,
                'customer_email' => $transaksi->user->email,
                'customer_phone' => $transaksi->user->phone ?? "08538888888",
                'order_items' => $orderItems,
                'return_url' => route('payment.status', $transaksi->order_number),
                'expired_time' => time() + (24 * 60 * 60),
                'signature' => Tripay::createSignature($this->merchantCode . $transaksi->order_number . $amount),
            ];

            Log::info('Tripay Request Body:', $body);

            $response = Http::timeout(30)
                ->withHeaders([
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type' => 'application/json',
                ])
                ->post($this->baseUrl . $endpoint, $body);

            $responseData = $response->json();

            Log::info('Tripay Response:', [
                'status' => $response->status(),
                'body' => $responseData,
            ]);

            if (!$response->successful()) {
                Log::error('Tripay API Error:', [
                    'status' => $response->status(),
                    'response' => $responseData,
                ]);
            }

            return $responseData;
        } catch (\Exception $e) {
            Log::error('Tripay Request Exception:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'message' => 'Gagal menghubungi server pembayaran: ' . $e->getMessage(),
            ];
        }
    }

    public function checkPaymentStatus($reference)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->get($this->baseUrl . '/transaction/detail', ['reference' => $reference]);

            return $response->json();
        } catch (\Exception $e) {
            Log::error('Check Payment Status Error:', [
                'reference' => $reference,
                'message' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'message' => 'Gagal mengecek status pembayaran'
            ];
        }
    }
}
