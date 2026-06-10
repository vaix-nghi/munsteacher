<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Child;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChildController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Child::all());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'avatar' => 'nullable|string|max:255',
        ]);

        $child = Child::create($validated);

        return response()->json($child, 201);
    }

    public function show(Child $child): JsonResponse
    {
        return response()->json($child);
    }
}
