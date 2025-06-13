<?php
// app/Rules/TurnstileRule.php

namespace App\Rules;

use App\Services\TurnstileService;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class TurnstileRule implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $turnstileService = app(TurnstileService::class);

        // Skip jika disabled
        if (!$turnstileService->isEnabled()) {
            return;
        }

        if (empty($value)) {
            $fail('Verifikasi keamanan diperlukan untuk login.');
            return;
        }

        if (!$turnstileService->verify($value)) {
            $fail('Verifikasi keamanan gagal. Silakan refresh halaman dan coba lagi.');
        }
    }
}
