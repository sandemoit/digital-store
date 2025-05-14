<?php

use App\Http\Controllers\ProfileController;
use App\Http\Middleware\CheckRole;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', CheckRole::class])->group(function () {
    Route::get('profile', [ProfileController::class, 'index'])->name('buyer.profile');
});
