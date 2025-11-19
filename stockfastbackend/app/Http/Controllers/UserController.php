<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

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
            $validatedData = $request->validated();
            
            $user->update($validatedData);

            return response()->json(['message' => 'Datos de usuario actualizados correctamente', 'user' => $user], 200);
        } catch (\Throwable $th) {
            //throw $th;
            Log::error('updateUserData@UserController Error al actualizar el usuario: ' . $th->getMessage());
            return response()->json(['error' => 'Error al actualizar el usuario'], 500);
        }        
    }

    public function updatePassword() {
        try {
            //code...
        } catch (\Throwable $th) {
            //throw $th;
        }
    }

}
