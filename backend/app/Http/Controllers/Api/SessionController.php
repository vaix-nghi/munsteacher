<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Answer;
use App\Models\LearningSession;
use App\Models\Progress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class SessionController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'child_id'        => 'required|exists:children,id',
            'module'          => 'required|string|max:100',
            'score'           => 'required|integer|min:0',
            'total'           => 'required|integer|min:1',
            'duration'        => 'required|integer|min:0',
            'answers'         => 'array',
            'answers.*.question_type' => 'required|string',
            'answers.*.difficulty'    => 'required|integer|min:1|max:3',
            'answers.*.given_answer'  => 'required|string',
            'answers.*.is_correct'    => 'required|boolean',
            'answers.*.time_spent_ms' => 'required|integer|min:0',
        ]);

        $session = DB::transaction(function () use ($validated) {
            $session = LearningSession::create([
                'child_id' => $validated['child_id'],
                'module'   => $validated['module'],
                'score'    => $validated['score'],
                'total'    => $validated['total'],
                'duration' => $validated['duration'],
            ]);

            if (!empty($validated['answers'])) {
                $answers = array_map(fn ($a) => array_merge($a, [
                    'session_id' => $session->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]), $validated['answers']);
                Answer::insert($answers);
            }

            $this->updateProgress($validated['child_id'], $validated['module'], $validated['score'], $validated['total']);

            return $session;
        });

        return response()->json($session->load('answers'), 201);
    }

    public function index(Request $request): JsonResponse
    {
        $childId = $request->query('child_id');
        $sessions = LearningSession::where('child_id', $childId)
            ->latest()
            ->limit(20)
            ->get();

        return response()->json($sessions);
    }

    private function updateProgress(int $childId, string $module, int $score, int $total): void
    {
        $progress = Progress::firstOrCreate(
            ['child_id' => $childId, 'module' => $module],
            ['stars' => 0, 'streak' => 0]
        );

        $stars = match (true) {
            $score >= $total       => 3,
            $score >= $total * 0.7 => 2,
            $score >= $total * 0.4 => 1,
            default                => 0,
        };

        if ($stars > $progress->stars) {
            $progress->stars = $stars;
        }

        $today = Carbon::today();
        $yesterday = Carbon::today()->subDay();
        $lastPlayed = $progress->last_played_at ? Carbon::parse($progress->last_played_at)->startOfDay() : null;

        if ($module === 'daily') {
            if ($lastPlayed === null || $lastPlayed->lt($yesterday)) {
                $progress->streak = 1;
            } elseif ($lastPlayed->eq($yesterday)) {
                $progress->streak++;
            }
            // if lastPlayed == today: keep streak unchanged
        }

        $progress->last_played_at = now();
        $progress->save();
    }
}
