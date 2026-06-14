<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Services\ChildTemplateResolver;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChildTemplateController extends Controller
{
    public function __construct(private readonly ChildTemplateResolver $resolver)
    {
    }

    public function index(Request $request, Child $child): JsonResponse
    {
        $exerciseType = $request->query('exercise_type');
        $difficulty = $request->filled('difficulty') ? (int) $request->query('difficulty') : null;

        return response()->json($this->resolver->resolve($child, $exerciseType, $difficulty));
    }
}
