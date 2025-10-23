<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DataController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\SaleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:api')->get('/me', [AuthController::class, 'me']);

Route::middleware('auth:api')->group(function () {
    Route::post('/crear-lote', [PurchaseController::class, 'store']);

    Route::get('/get-products', [ProductController::class, 'getProducts']);
    Route::delete('/delete-product/{id}', [ProductController::class, 'deleteProduct']);

    Route::post('/make-sale', [SaleController::class, 'store']);

    Route::get('/getgeneraldata', [DataController::class, 'getGeneralData']);
    Route::get('/get-stock-data', [DataController::class, 'getStockData']);

    Route::middleware('plan:Pro')->group(function () {});
});
