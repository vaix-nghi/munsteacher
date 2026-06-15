<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\DailyChallengeConfig;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DailyChallengeConfigController extends Controller
{
    public function show(Child $child): JsonResponse
    {
        return response()->json(DailyChallengeConfig::resolveForChild($child));
    }

    public function update(Request $request, Child $child): JsonResponse
    {
        $validated = $request->validate($this->rules());

        $config = DailyChallengeConfig::updateOrCreate(
            ['child_id' => $child->id],
            array_merge($validated, ['is_active' => $validated['is_active'] ?? true])
        );

        return response()->json($config);
    }

    public function destroy(Child $child): JsonResponse
    {
        DailyChallengeConfig::query()->where('child_id', $child->id)->delete();

        return response()->json(DailyChallengeConfig::resolveForChild($child));
    }

    public function updateDefault(Request $request): JsonResponse
    {
        $validated = $request->validate($this->rules());

        $config = DailyChallengeConfig::updateOrCreate(
            ['child_id' => null],
            array_merge($validated, ['is_active' => $validated['is_active'] ?? true])
        );

        return response()->json($config);
    }

    private function rules(): array
    {
        return [
            'number_sense_count' => ['required', 'integer', 'min:0', 'max:50'],
            'mental_math_count' => ['required', 'integer', 'min:0', 'max:50'],
            'story_math_count' => ['required', 'integer', 'min:0', 'max:50'],
            'total_time_seconds' => ['required', 'integer', 'min:30', 'max:3600'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
