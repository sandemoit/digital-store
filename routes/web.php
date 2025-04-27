<?php

use App\Http\Controllers\KategoriController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/produk/data', [ProductController::class, 'data']);
    Route::resource('/produk', ProductController::class);
    Route::resource('/kategori', KategoriController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
