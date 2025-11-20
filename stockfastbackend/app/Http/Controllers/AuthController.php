<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Requests\RegisterRequest;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        try {
            $data = $request->validated();

            $user = User::create($data);

            $user->load('plan');

            $planName = $user->plan ? $user->plan->name : null;

            $token = JWTAuth::claims([
                'username' => $user->username,
                'plan' => $planName,
            ])->fromUser($user);

            return response()->json(['success' => true, 'token' => $token], 200);
        } catch (\Throwable $th) {
            Log::error('Error en register@AuthController', ['exception' => $th->getMessage()]);
            return response()->json(['error' => 'Error al registrar el usuario'], 500);
        }
    }


    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Credenciales inválidas'], 401);
        }

        $user = Auth::user();

        $token = JWTAuth::claims([
            'username' => $user->username,
            'plan' => $user->plan->name
        ])->fromUser($user);

        return response()->json([
            'success' => true,
            'token' => $token
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
