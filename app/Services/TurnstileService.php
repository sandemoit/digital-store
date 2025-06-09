<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TurnstileService
{
    private string $secretKey;
    private string $verifyUrl;

    public function __construct()
    {
        $this->secretKey = config('services.cloudflare.turnstile.secret_key');
        $this->verifyUrl = config('services.cloudflare.turnstile.verify_url');
    }

    public function verify(string $token, ?string $remoteIp = null): bool
    {
        try {
            $response = Http::asForm()->post($this->verifyUrl, [
                'secret' => $this->secretKey,
                'response' => $token,
                'remoteip' => $remoteIp ?? request()->ip(),
            ]);

            $result = $response->json();

            if (!$response->successful()) {
                Log::error('Turnstile verification failed', [
                    'status' => $response->status(),
                    'response' => $result
                ]);
                return false;
            }

            return $result['success'] ?? false;
        } catch (\Throwable $e) {
            Log::error('Turnstile verification error: ' . $e->getMessage());
            return false;
        }
    }

    public function getSiteKey(): string
    {
        return config('services.cloudflare.turnstile.site_key');
    }
}
