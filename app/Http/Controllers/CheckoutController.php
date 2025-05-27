<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\PaymentMethod;

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

        // Get active payment methods grouped by type
        $paymentMethods = PaymentMethod::where('is_active', true)
            ->orderBy('type')
            ->orderBy('name')
            ->get()
            ->groupBy('type');

        return Inertia::render('Landing/Checkout/Index', [
            'cartItems' => $cartItems,
            'subtotal' => $subtotal,
            'walletBalance' => $walletBalance,
            'maxWalletUsage' => $maxWalletUsage,
            'paymentMethods' => $paymentMethods
        ]);
    }
}
