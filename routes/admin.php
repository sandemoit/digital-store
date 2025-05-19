<?php

use App\Http\Middleware\CheckRole;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\KategoriController;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', CheckRole::class])->prefix('admin')->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('admin.dashboard');

    Route::get('/produk/data', [ProductController::class, 'data']);
    Route::resource('product', ProductController::class);

    Route::resource('/kategori', KategoriController::class);
});
