<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExerciseType;
use Illuminate\Http\JsonResponse;

class ExerciseTypeController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            ExerciseType::query()
                ->active()
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
        );
    }
}
