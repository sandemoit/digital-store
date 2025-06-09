<?php

namespace App\Http\Controllers;

use App\Helpers\Tripay;
use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TripayController extends Controller
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
        $orderItems = [];
        foreach ($transaksi->items as $item) {
            $orderItems[] = [
                'sku' => $item->product->id,
                'name' => $item->product->name,
                'quantity' => 1,
                'price' => (int) $item->total,
            ];
        }

        $amount = (int) $transaksi->subtotal;

        $body = [
            'method' => $transaksi->paymentMethod->code,
            'merchant_ref' => $transaksi->order_number,
            'amount' => $amount,
            'customer_name' => $transaksi->user->name,
            'customer_email' => $transaksi->user->email,
            'customer_phone' => "08538888888",
            'order_items' => $orderItems,
            'return_url' => route('payment.status', $transaksi->order_number),
            'signature' => Tripay::createSignature($this->merchantCode . $transaksi->order_number . $amount),
        ];

        // dd($body);

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey,
        ])->post($this->baseUrl . $endpoint, $body);

        $response = $response->json();

        return $response;
    }
}
