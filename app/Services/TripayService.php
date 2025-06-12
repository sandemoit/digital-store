<?php

namespace App\Services;

use App\Helpers\Tripay;
use App\Models\Product;
use App\Models\Transaksi;
use Google\Rpc\Context\AttributeContext\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;

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

    public function callback(Request $request)
    {
        $callbackSignature = $request->server('HTTP_X_CALLBACK_SIGNATURE');
        $json = file_get_contents('php://input');
        $signature = Tripay::createSignature($json);;

        if ($signature !== (string) $callbackSignature) {
            return Response::json([
                'success' => false,
                'message' => 'Invalid signature',
            ]);
        }

        if ('payment_status' !== (string) $request->server('HTTP_X_CALLBACK_EVENT')) {
            return Response::json([
                'success' => false,
                'message' => 'Unrecognized callback event, no action was taken',
            ]);
        }

        $data = json_decode($json);

        if (JSON_ERROR_NONE !== json_last_error()) {
            return Response::json([
                'success' => false,
                'message' => 'Invalid data sent by tripay',
            ]);
        }

        $invoiceId = $data->merchant_ref;
        $status = strtoupper((string) $data->status);

        $transaction = Transaksi::with('items')
            ->where('order_number', $request->order_id)
            ->firstOrFail();

        $productIds = $transaction->items->pluck('product_id');
        $produk = Product::whereIn('id', $productIds)->select('id', 'is_proses')->get();
        $isProses = $produk->first()?->is_proses;

        if (!$transaction) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        switch ($status) {
            case 'PAID':
                if ($isProses === true) {
                    $transaction->update(['status' => 'processing', 'payment_status' => 'paid']);
                } else {
                    $transaction->update(['status' => 'completed', 'payment_status' => 'paid']);
                }
                break;
            case 'UNPAID':
                $transaction->update(['status' => 'pending', 'payment_status' => 'pending']);
                break;
            case 'FAILED':
                $transaction->update(['status' => 'cancelled', 'payment_status' => 'failed']);
                break;
            case 'EXPIRED':
                $transaction->update(['status' => 'cancelled', 'payment_status' => 'failed']);
                break;
            case 'REFUND':
                $transaction->update(['status' => 'cancelled', 'payment_status' => 'cancelled']);
                break;
            default:
                $transaction->update(['status' => 'unknown', 'payment_status' => 'unknown']);
                break;
        }

        return Response::json(['success' => true]);
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
