<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class UnduhController extends Controller
{
    /**
     * Download purchased product
     */
    public function downloadProduct($productId)
    {
        // Verify user has purchased this product
        $hasPurchased = Transaksi::where('user_id', Auth::id())
            ->where('status', 'completed')
            ->where('payment_status', 'paid')
            ->whereHas('items', function ($query) use ($productId) {
                $query->where('product_id', $productId);
            })
            ->exists();

        if (!$hasPurchased) {
            return response()->json([
                'error' => 'Anda belum membeli produk ini atau transaksi belum selesai'
            ], 403);
        }

        $product = Product::findOrFail($productId);

        if (!$product->file_url) {
            return response()->json([
                'error' => 'File produk tidak tersedia'
            ], 404);
        }

        // Log download activity (optional)
        Log::info('Product downloaded', [
            'user_id' => Auth::id(),
            'product_id' => $productId,
            'product_name' => $product->name,
            'timestamp' => now()
        ]);

        // Return download URL or redirect to file
        return response()->json([
            'download_url' => $product->file_url,
            'product_name' => $product->name
        ]);
    }
}
