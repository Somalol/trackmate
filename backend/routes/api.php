<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TransactionController;

// Publikus végpontok (ide bárki jöhet)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Védett végpontok (csak bejelentkezett felhasználóknak, Sanctum tokennel)
Route::middleware('auth:sanctum')->group(function () {
    // Kijelentkezés
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Csoport csatlakozás (Ezt az apiResource ELÉ kell tenni, hogy a Laravel ne higgye azt, hogy a "join" egy csoport ID!)
    Route::post('/groups/join', [GroupController::class, 'join']);
    
    // Az apiResource automatikusan generálja a GET, POST, PUT, DELETE végpontokat
    Route::apiResource('groups', GroupController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('transactions', TransactionController::class);
});