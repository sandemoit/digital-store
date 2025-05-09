<?php

use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\AplikasiController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\KategoriController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/list/produk/home', [HomeController::class, 'produk'])->name('list.produk.home');

Route::resource('product', AplikasiController::class);
Route::resource('cart', CartController::class);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/produk/data', [ProductController::class, 'data']);
    Route::resource('produk', ProductController::class);

    Route::resource('/kategori', KategoriController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
