<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        // Jika user adalah admin, selalu berikan akses
        if (Auth::user()->role === 'admin') {
            return $next($request);
        }

        // Path yang hanya boleh diakses oleh admin
        $adminOnlyPaths = [
            'admin/*',
        ];

        // Cek apakah request saat ini menuju ke path admin
        foreach ($adminOnlyPaths as $path) {
            if ($request->is($path)) {
                abort(403, 'Unauthorized action.');
            }
        }

        return $next($request);
    }
}
