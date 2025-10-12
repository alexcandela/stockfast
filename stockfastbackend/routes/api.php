<?php

use App\Http\Controllers\LoteController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/crear-lote', [LoteController::class, 'store']);
