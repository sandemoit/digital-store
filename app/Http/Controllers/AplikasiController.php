<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AplikasiController extends Controller
{
    public function index()
    {
        $produk = Product::with(['kategori'])
            ->withCount('ulasan')
            ->withAvg('ulasan', 'rating')
            ->where('is_active', true)
            ->latest()
            ->get();

        return Inertia::render('Landing/Produk/Index', [
            'produk' => $produk,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $produk = Product::with([
            'kategori',
            'komentar' => function ($query) {
                $query->whereNull('parent_id') // Get only parent comments
                    ->with([
                        'user:id,name',
                        'replies' => function ($query) {
                            $query->with('user:id,name');
                        },
                        'likes' // Include likes count for comments
                    ])
                    ->withCount('likes') // Count likes for each comment
                    ->orderBy('created_at', 'desc');
            },
            'ulasan' => function ($query) {
                $query->with('user:id,name')
                    ->orderBy('created_at', 'desc');
            }
        ])
            ->withCount(['transaksi as transaksi_sukses_count' => function ($query) {
                $query->where('status_transaksi', 'sukses');
            }])
            ->withCount('ulasan')
            ->withAvg('ulasan', 'rating')
            ->findOrFail($id);

        $produk->ulasan_avg_rating = $produk->ulasan_avg_rating ?? 0;

        // For logged in users, check which comments they've liked
        if (Auth::check()) {
            $userId = Auth::id();

            // Transform komentar data to include isLiked flag
            $produk->komentar->transform(function ($komentar) use ($userId) {
                $komentar->is_liked = $komentar->isLikedBy($userId);
                return $komentar;
            });
        }

        return inertia('Landing/Produk/Show', [
            'title' => 'Detail Produk',
            'produk' => $produk,
            'canComment' => Auth::check() && Auth::user()->role === 'admin',
            'isLoggedIn' => Auth::check(),
            'userId' => Auth::id()
        ]);
    }
}
