<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QuestionTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class QuestionTemplateController extends Controller
{
    private const QUESTION_KINDS = ['count', 'compare', 'add', 'sub', 'add_missing', 'sub_missing', 'story'];

    private const GENERATION_STRATEGIES = ['rule_based', 'static'];

    public function index(Request $request): JsonResponse
    {
        $templates = QuestionTemplate::query()
            ->with('exerciseType')
            ->when($request->filled('exercise_type'), function ($query) use ($request) {
                $query->whereHas('exerciseType', fn ($exerciseTypeQuery) => $exerciseTypeQuery->where('slug', $request->query('exercise_type')));
            })
            ->when($request->filled('grade'), fn ($query) => $query->where('grade', (int) $request->query('grade')))
            ->when($request->filled('difficulty'), fn ($query) => $query->where('difficulty', (int) $request->query('difficulty')))
            ->when($request->has('is_active'), fn ($query) => $query->where('is_active', $request->boolean('is_active')))
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return response()->json($templates);
    }

    public function show(QuestionTemplate $questionTemplate): JsonResponse
    {
        return response()->json($questionTemplate->load('exerciseType'));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate($this->rules());

        $template = QuestionTemplate::create($validated);

        return response()->json($template->load('exerciseType'), 201);
    }

    public function update(Request $request, QuestionTemplate $questionTemplate): JsonResponse
    {
        $validated = $request->validate($this->rules());

        $questionTemplate->update($validated);

        return response()->json($questionTemplate->load('exerciseType'));
    }

    public function toggle(QuestionTemplate $questionTemplate): JsonResponse
    {
        $questionTemplate->update([
            'is_active' => ! $questionTemplate->is_active,
        ]);

        return response()->json($questionTemplate->load('exerciseType'));
    }

    private function rules(): array
    {
        return [
            'exercise_type_id' => ['required', 'exists:exercise_types,id'],
            'grade' => ['required', 'integer', 'min:1', 'max:12'],
            'difficulty' => ['required', 'integer', 'min:1', 'max:10'],
            'question_kind' => ['required', 'string', Rule::in(self::QUESTION_KINDS)],
            'generation_strategy' => ['required', 'string', Rule::in(self::GENERATION_STRATEGIES)],
            'rules' => ['required', 'array'],
            'possible_answers' => ['required', 'array'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
