<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use App\Models\TransaksiItem;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function index()
    {
        // Query untuk mendapatkan transaksi
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
                    $query->select('id', 'name', 'gambar', 'file_url', 'harga', 'id_kategori');
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

        // Query untuk mendapatkan produk yang telah dibeli
        $purchasedProducts = TransaksiItem::whereHas('transaksi', function ($query) {
            $query->where('user_id', Auth::id())
                ->where('status', 'completed'); // Hanya transaksi yang selesai
        })
            ->with(['product' => function ($query) {
                $query->select('id', 'name', 'gambar', 'file_url', 'harga', 'id_kategori');
            }, 'product.kategori' => function ($query) {
                $query->select('id', 'nama');
            }])
            ->get()
            ->pluck('product')
            ->unique('id') // Hapus duplikat jika ada
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'gambar' => $product->gambar,
                    'file_url' => $product->file_url,
                    'harga' => (float) $product->harga,
                    'id_kategori' => $product->id_kategori,
                    'kategori' => $product->kategori ? [
                        'nama' => $product->kategori->nama
                    ] : null
                ];
            })
            ->values()
            ->toArray();

        return inertia('Landing/Profile/Index', [
            'title' => 'Profile',
            'transactions' => $transactions,
            'purchasedProducts' => $purchasedProducts
        ]);
    }
}
