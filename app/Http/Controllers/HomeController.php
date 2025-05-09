<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use App\Models\Product;

class HomeController extends Controller
{
    public function index()
    {
        // belum selesai, karena masih mau join dengan transaksi
        $title = 'Home';
        return inertia('welcome', [
            'title' => $title,
            'produk' => Product::query()->with('kategori')
                ->select('id', 'name', 'harga', 'gambar', 'id_kategori')
                ->where('is_active', 1)
                ->orderBy('created_at', 'desc')
                ->take(8)
                ->get(),
            'kategori' => Kategori::select('id', 'nama')->get(),
        ]);
    }
}
