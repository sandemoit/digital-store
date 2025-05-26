<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CheckoutController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $cartItems = $user->carts()->with('product')->get();

        $subtotal = $cartItems->sum(function ($item) {
            return $item->product->harga * $item->jumlah;
        });

        $walletBalance = $user->wallet_balance ?? 0;
        $maxWalletUsage = min($walletBalance, $subtotal * 0.5);

        return Inertia::render('Landing/Checkout/Index', [
            'cartItems' => $cartItems,
            'subtotal' => $subtotal,
            'walletBalance' => $walletBalance,
            'maxWalletUsage' => $maxWalletUsage,
            'provinces' => [
                'Jawa Tengah',
                'Jawa Barat',
                'Jawa Timur',
                'DKI Jakarta',
                // Add more provinces as needed
            ],
            'paymentMethods' => [
                [
                    'id' => 1,
                    'name' => 'Pembayaran ORIS',
                    'description' => 'Sistem pembayaran menggunakan Duitku.'
                ],
                [
                    'id' => 2,
                    'name' => 'Pembayaran Dana',
                    'description' => 'Pembayaran OVO'
                ],
                [
                    'id' => 3,
                    'name' => 'Pembayaran VA BNI',
                    'description' => 'Pembayaran BRIVA'
                ],
            ]
        ]);
    }
}
