<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\TodoListController;
use App\Http\Controllers\TodoItemController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/profile-picture', [AuthController::class, 'uploadProfilePicture']);
    
    Route::post('/groups/join', [GroupController::class, 'join']);
    Route::delete('/groups/{group}/members/{userId}', [GroupController::class, 'removeMember']);
    
    Route::apiResource('groups', GroupController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('transactions', TransactionController::class);

    Route::apiResource('todo-lists', TodoListController::class)->except(['show', 'update']);
    Route::apiResource('todo-items', TodoItemController::class)->except(['index', 'show']);
});