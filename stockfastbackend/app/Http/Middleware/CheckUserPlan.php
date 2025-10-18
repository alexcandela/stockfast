<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckUserPlan
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next, $requiredPlan)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Verificar expiración
        if ($user->plan_expires_at && $user->plan_expires_at->isPast()) {
            return response()->json(['error' => 'Your plan has expired.'], 403);
        }

        // Verificar tipo de plan
        if ($user->plan->name !== $requiredPlan) {
            return response()->json(['error' => 'Access denied. ' . $requiredPlan . ' plan required.'], 403);
        }

        return $next($request);
    }
}
