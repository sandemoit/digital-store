<?php

use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ProfileController;
use App\Http\Middleware\CheckRole;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', CheckRole::class])->group(function () {
    Route::get('profile', [ProfileController::class, 'index'])->name('buyer.profile');

    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout');
    Route::post('/checkout/process', [CheckoutController::class, 'process'])->name('checkout.process');

    Route::get('/payment/detail/{orderNumber}', [CheckoutController::class, 'paymentDetail'])->name('payment.detail');
    Route::get('/payment/gateway/{orderNumber}', [CheckoutController::class, 'paymentGateway'])->name('payment.gateway');
    Route::get('/payment/success/{orderNumber?}', [CheckoutController::class, 'success'])->name('payment.success');
    Route::post('/payment/cancel/{orderNumber}', [CheckoutController::class, 'cancel'])->name('payment.cancel');
});
