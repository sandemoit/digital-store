<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $cart = Cart::with('product')->where('user_id', Auth::id())->get();

        return Inertia::render('Landing/Cart/Index', [
            'title' => 'Keranjang Belanja',
            'cart' => $cart
        ]);
    }
}
