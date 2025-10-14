<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\PurchaseRequest;
use App\Models\Purchase;
use Illuminate\Support\Facades\Auth;

class PurchaseController extends Controller
{
    public function store(PurchaseRequest $request) {
        $data = $request->validated();
        try {
            $user = Auth::user();
            $purchase = Purchase::createWithProducts($data, $user);
            return response()->json([
                'message' => 'success',
            ], 200);
        } catch (\Throwable $th) {
            Log::error('Error en store@PurchaseController', ['exception' => $th->getMessage()]);
            return response()->json(['message' => 'error'], 404);
        }
    }
}
