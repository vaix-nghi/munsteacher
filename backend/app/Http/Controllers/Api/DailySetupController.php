<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\DailyChallengeConfig;
use App\Services\ChildTemplateResolver;
use Illuminate\Http\JsonResponse;

class DailySetupController extends Controller
{
    public function __construct(private readonly ChildTemplateResolver $resolver)
    {
    }

    public function show(Child $child): JsonResponse
    {
        return response()->json([
            'config' => DailyChallengeConfig::resolveForChild($child),
            'templates' => [
                'number_sense' => $this->resolver->resolveForType($child, 'number-sense'),
                'mental_math' => $this->resolver->resolveForType($child, 'mental-math'),
                'story_math' => $this->resolver->resolveForType($child, 'story-math'),
            ],
        ]);
    }
}
