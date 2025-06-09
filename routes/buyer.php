<?php

use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UnduhController;
use App\Http\Middleware\CheckRole;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', CheckRole::class])->group(function () {
    Route::get('/profile', [ProfileController::class, 'index'])->name('buyer.profile');
    Route::get('/profile/unduh', [UnduhController::class, 'UnduhController'])->name('buyer.unduh');

    Route::get('/profile/purchased-products', [UnduhController::class, 'getPurchasedProducts'])
        ->name('profile.purchased-products');

    // Download specific product
    Route::get('/profile/download/{product}', [UnduhController::class, 'downloadProduct'])
        ->name('profile.download-product');

    // Get products by transaction
    Route::get('/profile/transaction/{transaction}/products', [UnduhController::class, 'getTransactionProducts'])
        ->name('profile.transaction-products');

    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout');
    Route::post('/checkout/process', [CheckoutController::class, 'process'])->name('checkout.process');

    Route::get('/payment/checkout/{orderNumber}', [CheckoutController::class, 'paymentDetail'])->name('payment.checkout');
    Route::get('/payment/gateway/{orderNumber}', [CheckoutController::class, 'paymentGateway'])->name('payment.gateway');
    // Route::get('/payment/success/{orderNumber?}', [CheckoutController::class, 'success'])->name('payment.success');
    Route::get('/payment/cancel/{orderNumber}', [CheckoutController::class, 'cancelPayment'])->name('payment.cancel');

    Route::post('/payment/upload/{orderNumber}', [CheckoutController::class, 'uploadPaymentProof']);
    Route::get('/payment/upload/success/{orderNumber}', [CheckoutController::class, 'uploadSuccess'])->name('payment.upload.success');
    Route::get('/payment/status/{orderNumber}', [CheckoutController::class, 'statusPayment'])->name('payment.status');
    Route::get('/payment/cek/{orderNumber}', [CheckoutController::class, 'cekStatus'])->name('payment.cekStatus');
});
