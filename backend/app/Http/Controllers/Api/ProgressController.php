<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Answer;
use App\Models\Progress;
use Illuminate\Http\JsonResponse;

class ProgressController extends Controller
{
    public function show(int $childId): JsonResponse
    {
        $modules = ['number-sense', 'mental-math', 'story-math', 'daily'];

        $progress = Progress::where('child_id', $childId)->get()->keyBy('module');

        $accuracy = Answer::whereHas('session', fn ($q) => $q->where('child_id', $childId))
            ->selectRaw('
                learning_sessions.module,
                COUNT(*) as total_count,
                SUM(is_correct) as correct_count
            ')
            ->join('learning_sessions', 'answers.session_id', '=', 'learning_sessions.id')
            ->groupBy('learning_sessions.module')
            ->get()
            ->keyBy('module');

        $result = collect($modules)->map(function ($module) use ($progress, $accuracy) {
            $p = $progress->get($module);
            $a = $accuracy->get($module);

            return [
                'module'        => $module,
                'stars'         => $p?->stars ?? 0,
                'streak'        => $p?->streak ?? 0,
                'last_played_at' => $p?->last_played_at,
                'total_count'   => $a?->total_count ?? 0,
                'correct_count' => $a?->correct_count ?? 0,
                'accuracy'      => $a ? round($a->correct_count / $a->total_count * 100) : 0,
                'weak'          => $a ? ($a->correct_count / $a->total_count * 100 < 70) : false,
            ];
        });

        return response()->json($result);
    }
}
