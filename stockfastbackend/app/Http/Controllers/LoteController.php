<?php

namespace App\Http\Controllers;

use GuzzleHttp\Psr7\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class LoteController extends Controller
{
    public function store(Request $request) {
        try {
            dd($request->all());
            return response()->json(['message' => 'success'], 200);
        } catch (\Throwable $th) {
            Log::error("message");($th->getMessage());
            return response()->json(['message' => 'error'], 404);
        }
    }
}
