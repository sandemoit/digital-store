<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function index()
    {
        $transactions = Transaksi::select([
            'id',
            'order_number',
            'created_at',
            'total_amount',
            'status'
        ])
            ->where('user_id', Auth::id())
            ->with([
                'items' => function ($query) {
                    $query->select('id', 'transaksi_id', 'product_id');
                },
                'items.product' => function ($query) {
                    $query->select('id', 'id_kategori');
                },
                'items.product.kategori' => function ($query) {
                    $query->select('id', 'nama');
                }
            ])
            ->latest()
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'order_number' => $transaction->order_number,
                    'created_at' => $transaction->created_at->toISOString(),
                    'total_amount' => (float) $transaction->total_amount,
                    'status' => $transaction->status,
                    'items' => $transaction->items->map(function ($item) {
                        return [
                            'product' => $item->product ? [
                                'kategori' => $item->product->kategori ? [
                                    'nama' => $item->product->kategori->nama
                                ] : null
                            ] : null
                        ];
                    })
                ];
            });

        return inertia('Landing/Profile/Index', [
            'title' => 'Profile',
            'transactions' => $transactions
        ]);
    }
}
