<?php

use App\Http\Controllers\Api\ChildController;
use App\Http\Controllers\Api\ProgressController;
use App\Http\Controllers\Api\SessionController;
use Illuminate\Support\Facades\Route;

Route::get('children', [ChildController::class, 'index']);
Route::post('children', [ChildController::class, 'store']);
Route::get('children/{child}', [ChildController::class, 'show']);

Route::post('sessions', [SessionController::class, 'store']);
Route::get('sessions', [SessionController::class, 'index']);

Route::get('progress/{childId}', [ProgressController::class, 'show']);
