<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function getUserData()
    {
        try {
            $user = Auth::user();
            return response()->json(['user' => $user], 200);
        } catch (\Throwable $th) {
            //throw $th;
            Log::error('getUserData@UserController Error al obtener el usuario: ' . $th->getMessage());
            return response()->json(['error' => 'Error al obtener el usuario'], 500);
        }
    }

    public function updateUserData(UpdateUserRequest $request)
    {
        try {
            $loggedUser = Auth::user();
            $user = User::findOrFail($loggedUser->id);

            if ($user->username === 'johndoe') {
                return response()->json(['error' => 'No está permitido modificar los datos del usuario demo'], 403);
            }

            $validatedData = $request->validated();

            $user->update($validatedData);

            return response()->json(['message' => 'Datos de usuario actualizados correctamente', 'user' => $user], 200);
        } catch (\Throwable $th) {
            //throw $th;
            Log::error('updateUserData@UserController Error al actualizar el usuario: ' . $th->getMessage());
            return response()->json(['error' => 'Error al actualizar el usuario'], 500);
        }
    }

    public function updatePassword(UpdatePasswordRequest $request)
    {
        try {
            $loggedUser = Auth::user();
            $user = User::findOrFail($loggedUser->id);

            if ($user->username === 'johndoe') {
                return response()->json(['error' => 'No está permitido modificar los datos del usuario demo'], 403);
            }

            $validatedData = $request->validated();

            $user->password = Hash::make($validatedData['new_password']);
            $user->save();

            return response()->json(['message' => 'Contraseña actualizada correctamente', 'user' => $user], 200);
        } catch (\Throwable $th) {
            //throw $th;
            Log::error('updatePassword@UserController Error al actualizar la contraseña: ' . $th->getMessage());
            return response()->json(['error' => 'Error al actualizar la contraseña'], 500);
        }
    }
}
