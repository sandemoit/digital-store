<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TurnstileService
{
    private string $secretKey;
    private string $verifyUrl;
    private bool $enabled;

    public function __construct()
    {
        $this->secretKey = config('services.turnstile.secret_key');
        $this->verifyUrl = config('services.turnstile.verify_url');
        $this->enabled = config('services.turnstile.enabled', true);
    }

    public function verify(string $token, ?string $remoteIp = null): bool
    {
        // Skip verification if disabled (untuk development)
        if (!$this->enabled) {
            return true;
        }

        if (empty($token)) {
            return false;
        }

        try {
            $response = Http::timeout(10)->asForm()->post($this->verifyUrl, [
                'secret' => $this->secretKey,
                'response' => $token,
                'remoteip' => $remoteIp ?? request()->ip(),
            ]);

            $result = $response->json();

            return $result['success'] ?? false;
        } catch (\Exception $e) {
            Log::error('Turnstile verification failed', [
                'error' => $e->getMessage(),
                'token' => substr($token, 0, 10) . '...',
                'ip' => request()->ip()
            ]);

            // Pada production, return false
            // Pada development, bisa return true untuk bypass
            return app()->environment('local') && !$this->enabled;
        }
    }

    public function isEnabled(): bool
    {
        return $this->enabled;
    }
}
