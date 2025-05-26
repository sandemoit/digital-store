<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $cart = Cart::with(['product:id,name,harga,gambar'])
            ->where('user_id', Auth::id() ?? null)
            ->whereHas('product') // tanpa closure
            ->get()
            ->map(function ($item) {
                return [
                    'product_id' => $item->products_id,
                    'name' => $item->product->name,
                    'harga' => $item->product->harga,
                    'gambar' => $item->product->gambar[0]['path'] ?? null,
                    'quantity' => $item->jumlah
                ];
            });


        return Inertia::render('Landing/Cart/Index', [
            'title' => 'Keranjang Belanja',
            'cart' => $cart
        ]);
    }


    public function sync(Request $request)
    {
        try {
            DB::beginTransaction();

            $items = $request->input('items', []);

            foreach ($items as $item) {
                $cart = Cart::where('products_id', $item['id'])
                    ->where('user_id', Auth::id())
                    ->first();

                if ($cart) {
                    $cart->increment('jumlah', $item['quantity']);
                } else {
                    Cart::create([
                        'products_id' => $item['id'],
                        'user_id' => Auth::id(),
                        'jumlah' => $item['quantity']
                    ]);
                }
            }

            DB::commit();

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false], 500);
        }
    }

    public function remove($productId)
    {
        try {
            Cart::where('user_id', Auth::id())
                ->where('products_id', $productId)
                ->delete();

            return back()->with('success', 'Item dihapus dari keranjang');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal menghapus item']);
        }
    }

    public function destroy()
    {
        try {
            Cart::where('user_id', Auth::id())->delete();
            return back()->with('success', 'Keranjang berhasil dikosongkan');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal mengosongkan keranjang']);
        }
    }

    public function add($productId)
    {
        try {
            DB::beginTransaction();

            $product = Product::findOrFail($productId);

            $cart = Cart::where('products_id', $product->id)
                ->where('user_id', Auth::id())
                ->first();

            if (!$cart) {
                $cart = new Cart;
                $cart->products_id = $productId;
                $cart->user_id = Auth::id();
                $cart->jumlah = 1;
                $cart->save();
            } else {
                $cart->increment('jumlah');
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Produk berhasil ditambahkan ke keranjang',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan produk ke keranjang: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show()
    {
        if (Auth::check()) {
            $count = Cart::where('user_id', Auth::id())->count();
            return response()->json(['count' => $count]);
        }

        return response()->json(['count' => 0]);
    }
}
