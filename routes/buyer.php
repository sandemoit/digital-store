<?php

use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UnduhController;
use App\Http\Middleware\CheckRole;
use Illuminate\Support\Facades\Route;

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

    // Checkout
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout');
    Route::post('/checkout/process', [CheckoutController::class, 'process'])->name('checkout.process');

    // Payment manual
    Route::get('/payment/checkout/{orderNumber}', [CheckoutController::class, 'paymentManual'])->name('payment.checkout');

    // Payment gateway
    Route::get('/payment/gateway/{orderNumber}', [CheckoutController::class, 'paymentGateway'])->name('payment.gateway');
    Route::post('/payment/process-gateway/{orderNumber}', [CheckoutController::class, 'processPaymentGateway'])->name('payment.process-gateway');

    // Route::get('/payment/success/{orderNumber?}', [CheckoutController::class, 'success'])->name('payment.success');
    Route::get('/payment/cancel/{orderNumber}', [CheckoutController::class, 'cancelPayment'])->name('payment.cancel');

    // Manual payment upload
    Route::post('/payment/upload/{orderNumber}', [CheckoutController::class, 'uploadPaymentProof']);
    Route::get('/payment/upload/success/{orderNumber}', [CheckoutController::class, 'uploadSuccess'])->name('payment.upload.success');

    // Payment status
    Route::get('/payment/status/{orderNumber}', [CheckoutController::class, 'statusPayment'])->name('payment.status');
    Route::get('/payment/cek/{orderNumber}', [CheckoutController::class, 'cekStatus'])->name('payment.cekStatus');
});
