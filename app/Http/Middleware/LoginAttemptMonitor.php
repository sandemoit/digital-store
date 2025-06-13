<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;

class LoginAttemptMonitor
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->isMethod('POST') && $request->routeIs('login')) {
            $key = 'login_attempt:' . $request->ip();
            $attempts = RateLimiter::attempts($key);

            Log::info('Login attempt', [
                'ip' => $request->ip(),
                'email' => $request->input('email'),
                'user_agent' => $request->userAgent(),
                'attempts' => $attempts,
                'has_turnstile' => !empty($request->input('cf-turnstile-response')),
            ]);
        }

        return $next($request);
    }
}
