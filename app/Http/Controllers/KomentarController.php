<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Komentar;
use App\Models\KomentarLike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class KomentarController extends Controller
{
    /**
     * Store a new comment for a product.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $productId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request, $productId)
    {
        $request->validate([
            'isi' => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:komentars,id',
        ]);

        $product = Product::findOrFail($productId);

        $komentar = new Komentar([
            'isi' => $request->isi,
            'parent_id' => $request->parent_id,
            'user_id' => Auth::id(),
        ]);

        $product->komentar()->save($komentar);

        Log::info('New comment created', ['komentar_id' => $komentar->id, 'product_id' => $productId]);

        return back()->with('success', 'Komentar berhasil ditambahkan.');
    }

    /**
     * Toggle like for a comment.
     *
     * @param  int  $komentarId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function like($komentarId)
    {
        $komentar = Komentar::findOrFail($komentarId);
        $userId = Auth::id();

        // Check if user already liked this comment
        $existingLike = KomentarLike::where('komentar_id', $komentarId)
            ->where('user_id', $userId)
            ->first();

        if ($existingLike) {
            // Unlike if already liked
            $existingLike->delete();
            Log::info('Comment unliked', ['komentar_id' => $komentarId, 'user_id' => $userId]);
            $message = 'Berhasil membatalkan suka pada komentar.';
        } else {
            // Like if not yet liked
            KomentarLike::create([
                'komentar_id' => $komentarId,
                'user_id' => $userId,
            ]);
            Log::info('Comment liked', ['komentar_id' => $komentarId, 'user_id' => $userId]);
            $message = 'Berhasil menyukai komentar.';
        }

        return back()->with('success', $message);
    }
}
