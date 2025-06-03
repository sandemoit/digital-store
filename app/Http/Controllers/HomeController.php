<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use App\Models\Product;

class HomeController extends Controller
{
    public function index()
    {
        $produk = Product::query()
            ->with('kategori')
            ->withCount('ulasan')
            ->withAvg('ulasan', 'rating')
            ->select('id', 'name', 'harga', 'gambar', 'id_kategori', 'link_demo')
            ->where('is_active', 1)
            ->orderBy('created_at', 'desc')
            ->take(8)
            ->get();

        // Pastikan data ulasan terserialize dengan benar
        $produk->each(function ($item) {
            // Hindari nilai null pada ulasan_avg_rating, berikan nilai default 0
            $item->ulasan_avg_rating = $item->ulasan_avg_rating ?? 0;
        });

        return inertia('welcome', [
            'title' => 'Home',
            'produk' => $produk,
            'kategori' => Kategori::select('id', 'nama')->get(),
        ]);
    }

    public function syaratketentuan()
    {
        return inertia('Landing/Home/SyaratKetentuan', [
            'title' => 'Syarat Ketentuan',
        ]);
    }

    public function kebijakanprivasi()
    {
        return inertia('Landing/Home/KebijakanPrivasi', [
            'title' => 'Kebijakan Privasi',
        ]);
    }
}
