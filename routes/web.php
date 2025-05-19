<?php


use App\Http\Controllers\AplikasiController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\KomentarController;
use App\Http\Controllers\KontakController;
use App\Http\Middleware\XSS;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/list/produk/home', [HomeController::class, 'produk'])->name('list.produk.home');

Route::get('/kontak', [KontakController::class, 'index'])->name('kontak');
Route::resource('produk', AplikasiController::class);
Route::resource('cart', CartController::class);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/product/{productId}/komentar', [KomentarController::class, 'store'])->name('product.komentar.store');
    Route::post('/komentar/like/{komentarId}', [KomentarController::class, 'like'])->name('komentar.like');
});

Route::middleware(XSS::class)->group(function () {
    require __DIR__ . '/buyer.php';
    require __DIR__ . '/admin.php';
});
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
