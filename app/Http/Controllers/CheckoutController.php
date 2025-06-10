<?php

namespace App\Http\Controllers;

use App\Http\Requests\UploadPayment;
use App\Models\Cart;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\PaymentMethod;
use App\Models\Transaksi;
use App\Models\TransaksiItem;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class CheckoutController extends Controller
{
    public function index()
    {
        if (Auth::guest()) {
            return redirect()->route('login');
        }

        $user = Auth::user();
        $cartItems = $user->carts()->with('product')->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Keranjang belanja kosong.');
        }

        // Ensure numeric calculations
        $subtotal = $cartItems->sum(function ($item) {
            return floatval($item->product->harga) * intval($item->jumlah);
        });

        $walletBalance = floatval($user->wallet_balance ?? 0);
        $maxWalletUsage = min($walletBalance, $subtotal);

        // Get active payment methods grouped by type
        $paymentMethods = PaymentMethod::where('is_active', true)
            ->orderBy('type')
            ->orderBy('name')
            ->get()
            ->map(function ($method) {
                // Ensure fee is properly formatted as number and include type_fee
                return [
                    'id' => $method->id,
                    'name' => $method->name,
                    'code' => $method->code,
                    'type' => $method->type,
                    'method' => $method->method,
                    'type_fee' => $method->type_fee, // Add type_fee field
                    'fee' => floatval($method->fee),
                    'instructions' => $method->instructions,
                    'account_number' => $method->account_number,
                    'account_name' => $method->account_name,
                ];
            })
            ->groupBy('type');

        return Inertia::render('Landing/Checkout/Index', [
            'cartItems' => $cartItems->map(function ($item) {
                return [
                    'id' => $item->id,
                    'jumlah' => intval($item->jumlah),
                    'product' => [
                        'name' => $item->product->name,
                        'harga' => floatval($item->product->harga),
                    ]
                ];
            }),
            'subtotal' => $subtotal,
            'walletBalance' => $walletBalance,
            'maxWalletUsage' => $maxWalletUsage,
            'paymentMethods' => $paymentMethods
        ]);
    }

    public function process(Request $request)
    {
        $request->validate([
            'payment_method_id' => 'required|exists:payment_methods,id',
            'wallet_amount' => 'nullable|numeric|min:0',
        ]);

        $user = Auth::user();
        $paymentMethod = PaymentMethod::findOrFail($request->payment_method_id);

        // Get cart items
        $cartItems = $user->carts()->with('product')->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Keranjang belanja kosong.');
        }

        // Calculate totals
        $subtotal = $cartItems->sum(function ($item) {
            return floatval($item->product->harga) * intval($item->jumlah);
        });

        $walletAmount = floatval($request->wallet_amount ?? 0);

        // Calculate payment fee based on type_fee
        $paymentFee = 0;
        if ($paymentMethod->type_fee === 'percent') {
            $paymentFee = ($subtotal * floatval($paymentMethod->fee)) / 100;
        } else {
            $paymentFee = floatval($paymentMethod->fee);
        }

        // Calculate total: subtotal + payment fee - wallet amount
        $totalBeforeWallet = $subtotal + $paymentFee;
        $totalAmount = max(0, $totalBeforeWallet - $walletAmount);

        // Validate wallet usage
        $maxWalletUsage = min(floatval($user->wallet_balance ?? 0), $subtotal);
        if ($walletAmount > $maxWalletUsage) {
            return back()->withErrors([
                'wallet_amount' => 'Penggunaan dompet melebihi batas maksimal.'
            ]);
        }

        // Validate user has sufficient wallet balance
        if ($walletAmount > $user->wallet_balance) {
            return back()->withErrors([
                'wallet_amount' => 'Saldo dompet tidak mencukupi.'
            ]);
        }

        // If using wallet amount that covers the entire cost, still need minimum payment method selection
        if ($totalAmount <= 0 && $walletAmount >= $totalBeforeWallet) {
            $totalAmount = 0; // Full payment with wallet
        }

        DB::beginTransaction();

        try {
            // Generate unique order number
            $orderNumber = 'ORD-' . time() . '-' . rand(1000, 9999);

            // Create transaction record
            $transaction = Transaksi::create([
                'user_id' => $user->id,
                'payment_method_id' => $paymentMethod->id,
                'order_number' => $orderNumber,
                'subtotal' => $subtotal,
                'payment_fee' => $paymentFee,
                'wallet_amount' => $walletAmount,
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'payment_status' => $walletAmount >= $totalBeforeWallet ? 'paid' : 'pending',
            ]);

            // Create transaction items
            foreach ($cartItems as $item) {
                TransaksiItem::create([
                    'transaksi_id' => $transaction->id,
                    'product_id' => $item->products_id,
                    'quantity' => $item->jumlah,
                    'price' => $item->product->harga,
                    'total' => floatval($item->product->harga) * intval($item->jumlah), // Fixed: individual item total
                ]);
            }

            // Update wallet balance if wallet is used
            if ($walletAmount > 0) {
                $user->decrement('wallet_balance', $walletAmount);
            }

            // If fully paid with wallet, mark as completed
            if ($walletAmount >= $totalBeforeWallet) {
                $transaction->update([
                    'status' => 'completed',
                    'payment_status' => 'paid',
                    'payment_date' => now(),
                ]);
            }

            DB::commit();

            // Route based on payment method
            if ($paymentMethod->method === 'automatic') {
                // Redirect to payment gateway processing page
                return redirect()->route('payment.gateway', $transaction->order_number);
            }

            return redirect()->route('payment.checkout', $transaction->order_number)
                ->with('success', 'Transaksi berhasil dibuat. Silakan upload bukti pembayaran.');
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Transaction Creation Error: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors([
                'payment' => 'Terjadi kesalahan dalam memproses pembayaran. Silakan coba lagi.'
            ]);
        }
    }

    public function paymentGateway($orderNumber)
    {
        $transaction = Transaksi::with(['paymentMethod', 'items.product', 'user'])
            ->where('order_number', $orderNumber)
            ->where('user_id', Auth::user()->id)
            ->firstOrFail();

        return Inertia::render('Landing/Payment/Redirect', [
            'transaction' => [
                'id' => $transaction->id,
                'order_number' => $transaction->order_number,
                'total_amount' => $transaction->total_amount,
                'payment_method' => $transaction->paymentMethod->method ?? 'manual'
            ],
            'checkout_url' => $transaction->checkout_url,
            'skip_api_call' => !empty($transaction->checkout_url),
            'flash' => [
                'success' => 'Transaksi berhasil dibuat'
            ]
        ]);
    }

    public function processPaymentGateway($orderNumber)
    {
        try {
            $transaction = Transaksi::with(['paymentMethod', 'items.product', 'user'])
                ->where('order_number', $orderNumber)
                ->where('user_id', Auth::user()->id)
                ->firstOrFail();

            // Jika sudah ada checkout_url, return langsung
            if (!empty($transaction->checkout_url)) {
                return response()->json([
                    'success' => true,
                    'checkout_url' => $transaction->checkout_url,
                    'message' => 'Checkout URL sudah tersedia'
                ]);
            }

            DB::beginTransaction();

            $tripay = new TripayController();
            $response = $tripay->requestTransaksi($transaction, '/transaction/create');

            // Validasi response structure
            if (!is_array($response)) {
                throw new \Exception('Invalid response format from payment gateway');
            }

            // Check jika response sukses dan ada data
            if (isset($response['success']) && $response['success'] === true && isset($response['data'])) {
                $data = $response['data'];

                // Validasi checkout_url exists
                if (empty($data['checkout_url'])) {
                    throw new \Exception('Checkout URL tidak tersedia dalam response');
                }

                // Update transaction dengan data dari Tripay
                $updateData = [
                    'checkout_url' => $data['checkout_url']
                ];

                if (!empty($data['reference'])) {
                    $updateData['payment_reference'] = $data['reference'];
                }

                $transaction->update($updateData);

                // Clear cart after successful transaction creation
                $transaction->user->carts()->delete();

                DB::commit();

                return response()->json([
                    'success' => true,
                    'checkout_url' => $data['checkout_url'],
                    'message' => 'Transaksi berhasil dibuat',
                    'data' => [
                        'order_number' => $orderNumber
                    ]
                ]);
            } else {
                // Handle error response
                $errorMessage = 'Gagal membuat transaksi pembayaran';

                if (isset($response['message'])) {
                    $errorMessage = $response['message'];
                } elseif (isset($response['error'])) {
                    $errorMessage = $response['error'];
                }

                throw new \Exception($errorMessage);
            }
        } catch (\Exception $e) {
            DB::rollback();

            Log::error('Payment Gateway Error: ' . $e->getMessage(), [
                'order_number' => $orderNumber,
                'user_id' => Auth::user()->id,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'error_code' => 'PAYMENT_GATEWAY_ERROR'
            ], 500);
        }
    }

    public function paymentManual($orderNumber)
    {
        $transaction = Transaksi::with(['paymentMethod', 'items.product', 'user'])
            ->where('order_number', $orderNumber)
            ->where('user_id', Auth::user()->id)
            ->firstOrFail();

        if ($transaction->checkout_url) {
            return Inertia::render('Landing/Payment/Redirect', [
                'transaction' => [
                    'id' => $transaction->id,
                    'order_number' => $transaction->order_number,
                    'total_amount' => $transaction->total_amount,
                    'payment_method' => $transaction->paymentMethod->method ?? 'automatic'
                ],
                'checkout_url' => $transaction->checkout_url,
                'skip_api_call' => !empty($transaction->checkout_url),
                'flash' => [
                    'success' => 'Transaksi berhasil dibuat'
                ]
            ]);
        }

        if (in_array($transaction->payment_status, ['paid', 'completed'])) {
            return redirect()->route('payment.status', $transaction->order_number);
        }

        return Inertia::render('Landing/Payment/Detail', [
            'transaction' => [
                'id' => $transaction->id,
                'order_number' => $transaction->order_number,
                'subtotal' => $transaction->subtotal,
                'payment_fee' => $transaction->payment_fee,
                'wallet_amount' => $transaction->wallet_amount,
                'total_amount' => $transaction->total_amount,
                'status' => $transaction->status,
                'payment_status' => $transaction->payment_status,
                'created_at' => $transaction->created_at,
                'items' => $transaction->items->map(function ($item) {
                    return [
                        'quantity' => $item->quantity,
                        'price' => $item->price,
                        'total' => $item->total,
                        'product' => [
                            'name' => $item->product->name,
                        ]
                    ];
                })
            ],
            'paymentMethod' => [
                'name' => $transaction->paymentMethod->name,
                'type' => $transaction->paymentMethod->type,
                'method' => $transaction->paymentMethod->method,
                'instructions' => $transaction->paymentMethod->instructions,
                'account_number' => $transaction->paymentMethod->account_number,
                'account_name' => $transaction->paymentMethod->account_name,
            ],
        ]);
    }

    public function success($orderNumber = null)
    {
        $transaction = null;

        if ($orderNumber) {
            $transaction = Transaksi::where('id', $orderNumber)
                ->where('user_id', Auth::user()->id)
                ->first();
        }

        // return Inertia::render('Landing/Payment/Success', [
        //     'transaction' => $transaction ? [
        //         'order_number' => $transaction->order_number,
        //         'total_amount' => $transaction->total_amount,
        //         'status' => $transaction->status,
        //         'payment_status' => $transaction->payment_status,
        //     ] : null
        // ]);
    }

    public function uploadPaymentProof(UploadPayment $request, $orderNumber)
    {
        try {
            // Cari transaksi berdasarkan order number
            $transaction = Transaksi::where('order_number', $orderNumber)
                ->where('status', 'pending')
                ->where('payment_status', 'pending')
                ->firstOrFail();

            // Pastikan ini adalah metode pembayaran manual
            if (!$transaction->isManualPayment()) {
                return back()->withErrors(['error' => 'Upload bukti pembayaran hanya untuk metode pembayaran manual']);
            }

            // Hapus file lama jika ada
            if ($transaction->payment_proof && Storage::disk('public')->exists($transaction->payment_proof)) {
                Storage::disk('public')->delete($transaction->payment_proof);
            }

            // Upload file baru - gunakan $request->file() langsung tanpa validated()
            $file = $request->file('payment_proof');
            $filename = 'payment_proof_' . $orderNumber . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('payment-proofs', $filename, 'public');

            // Update transaksi
            $transaction->update([
                'payment_proof' => $path,
                'payment_status' => 'waiting_confirmation',
                'payment_date' => now(),
                'status' => 'processing'
            ]);

            // Redirect ke halaman sukses
            return redirect()->route('payment.upload.success', $orderNumber);
        } catch (\Exception $e) {
            Log::error('Upload payment proof error: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Gagal mengupload bukti pembayaran. Silakan coba lagi.']);
        }
    }

    /**
     * Halaman sukses upload bukti pembayaran
     */
    public function uploadSuccess($orderNumber)
    {
        $transaction = Transaksi::with(['items.product', 'paymentMethod'])
            ->where('order_number', $orderNumber)
            ->firstOrFail();

        if (!$transaction->payment_status === 'waiting_confirmation') {
            return redirect()->back()->with('error', 'Belum ada bukti pembayaran yang diupload');
        }

        if ($transaction->payment_status === 'paid') {
            return redirect()->route('payment.status', $orderNumber);
        }

        return Inertia::render('Landing/Payment/UploadSuccess', [
            'transaction' => $transaction,
        ]);
    }

    public function cancelPayment($orderNumber)
    {
        try {
            $transaction = Transaksi::where('order_number', $orderNumber)
                ->where('status', 'pending')
                ->firstOrFail();

            // Pastikan pembayaran belum dikonfirmasi
            if ($transaction->payment_status === 'paid') {
                return back()->withErrors(['error' => 'Pembayaran sudah dikonfirmasi, tidak dapat dibatalkan']);
            }

            // Update status transaksi
            $transaction->update([
                'status' => 'cancelled',
                'payment_status' => 'cancelled',
                'cancelled_at' => now(),
            ]);

            return redirect()->route('payment.status', $orderNumber)->with('success', 'Pesanan berhasil dibatalkan');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal membatalkan pesanan. Silakan coba lagi.']);
        }
    }

    public function statusPayment($orderNumber)
    {
        try {
            // Ambil transaksi berdasarkan order_number atau ID
            $transaction = Transaksi::with(['items.product', 'paymentMethod', 'user'])
                ->where('order_number', $orderNumber)
                ->firstOrFail();

            // Format data untuk frontend
            $transactionData = [
                'id' => $transaction->id,
                'order_number' => $transaction->order_number,
                'subtotal' => $transaction->subtotal,
                'payment_fee' => $transaction->payment_fee,
                'wallet_amount' => $transaction->wallet_amount,
                'total_amount' => $transaction->total_amount,
                'status' => $transaction->status,
                'payment_status' => $transaction->payment_status,
                'status_badge' => $transaction->status_badge,
                'payment_status_badge' => $transaction->payment_status_badge,
                'created_at' => $transaction->created_at,
                'confirmed_at' => $transaction->confirmed_at,
                'payment_date' => $transaction->payment_date,
                'cancelled_at' => $transaction->cancelled_at,
                'payment_method' => $transaction->paymentMethod,
                'can_be_cancelled' => $transaction->canBeCancelled(),
                'is_manual_payment' => $transaction->isManualPayment(),
                'has_payment_proof' => $transaction->hasPaymentProof(),
                'payment_proof_url' => $transaction->payment_proof_url,
                'items' => $transaction->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'quantity' => $item->quantity,
                        'price' => $item->price,
                        'total' => $item->total,
                        'product' => [
                            'name' => $item->product->name ?? 'Product tidak tersedia',
                            'type' => $item->product->type ?? 'unknown',
                        ]
                    ];
                })
            ];

            return Inertia::render('Landing/Payment/StatusPayment', [
                'transaction' => $transactionData
            ]);
        } catch (\Exception $e) {
            return redirect()->route('home')->with('error', 'Transaksi tidak ditemukan');
        }
    }

    public function cekStatus($orderNumber)
    {
        $transaction = Transaksi::where('order_number', $orderNumber)
            ->firstOrFail();

        if ($transaction->payment_status === 'waiting_confirmation') {
            return redirect()->back()->with('info', 'Mohon Maaf, Pembayaran belum dikonfirmasi');
        } else {
            return redirect()->route('payment.status', $orderNumber);
        }
    }
}
