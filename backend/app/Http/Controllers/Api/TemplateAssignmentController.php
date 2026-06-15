<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\TemplateAssignment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TemplateAssignmentController extends Controller
{
    public function index(Child $child): JsonResponse
    {
        return response()->json(
            $child->templateAssignments()
                ->with(['template.exerciseType'])
                ->orderByDesc('is_active')
                ->orderBy('id')
                ->get()
        );
    }

    public function store(Request $request, Child $child): JsonResponse
    {
        $validated = $request->validate([
            'template_id' => ['required', 'exists:question_templates,id'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $assignment = TemplateAssignment::updateOrCreate(
            [
                'child_id' => $child->id,
                'template_id' => $validated['template_id'],
            ],
            [
                'is_active' => $validated['is_active'] ?? true,
            ]
        );

        return response()->json($assignment->load(['template.exerciseType', 'child']), 201);
    }

    public function destroy(Child $child, int $assignmentId): JsonResponse
    {
        $assignment = $child->templateAssignments()->findOrFail($assignmentId);
        $assignment->delete();

        return response()->noContent();
    }
}
