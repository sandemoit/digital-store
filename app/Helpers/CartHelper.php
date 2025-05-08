<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Auth;
use App\Models\Cart;

class CartHelper
{
  public static function getCartCount(): int
  {
    if (Auth::check()) {
      return Cart::where('user_id', Auth::id())->count();
    }

    // Kalau nggak login, biarin frontend handle via localStorage
    return 0;
  }
}
