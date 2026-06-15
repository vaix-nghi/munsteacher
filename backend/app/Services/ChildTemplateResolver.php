<?php

namespace App\Services;

use App\Models\Child;
use App\Models\ExerciseType;
use App\Models\QuestionTemplate;
use App\Models\TemplateAssignment;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class ChildTemplateResolver
{
    public function resolve(Child $child, ?string $exerciseTypeSlug = null, ?int $difficulty = null): Collection
    {
        if ($exerciseTypeSlug !== null) {
            return $this->resolveForType($child, $exerciseTypeSlug, $difficulty);
        }

        return ExerciseType::query()
            ->active()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->flatMap(fn (ExerciseType $type) => $this->resolveForType($child, $type->slug, $difficulty))
            ->values();
    }

    public function resolveForType(Child $child, string $exerciseTypeSlug, ?int $difficulty = null): Collection
    {
        $assignedTemplates = TemplateAssignment::query()
            ->with(['template.exerciseType'])
            ->where('child_id', $child->id)
            ->where('is_active', true)
            ->whereHas('template', function (Builder $query) use ($exerciseTypeSlug, $difficulty) {
                $this->applyTemplateFilters($query, $exerciseTypeSlug, $difficulty);
            })
            ->get()
            ->pluck('template')
            ->filter(fn ($template) => $template !== null && $template->is_active)
            ->sortBy([['sort_order', 'asc'], ['id', 'asc']])
            ->values();

        if ($assignedTemplates->isNotEmpty()) {
            return $assignedTemplates;
        }

        return QuestionTemplate::query()
            ->with('exerciseType')
            ->active()
            ->where('grade', $child->grade)
            ->whereHas('exerciseType', fn (Builder $query) => $query->where('slug', $exerciseTypeSlug)->where('is_active', true))
            ->when($difficulty !== null, fn (Builder $query) => $query->where('difficulty', $difficulty))
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
    }

    private function applyTemplateFilters(Builder $query, string $exerciseTypeSlug, ?int $difficulty = null): void
    {
        $query->where('is_active', true)
            ->whereHas('exerciseType', fn (Builder $exerciseTypeQuery) => $exerciseTypeQuery
                ->where('slug', $exerciseTypeSlug)
                ->where('is_active', true));

        if ($difficulty !== null) {
            $query->where('difficulty', $difficulty);
        }
    }
}
