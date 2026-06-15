<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuestionTemplate extends Model
{
    protected $fillable = [
        'exercise_type_id',
        'grade',
        'difficulty',
        'question_kind',
        'generation_strategy',
        'rules',
        'possible_answers',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'rules' => 'array',
        'possible_answers' => 'array',
        'is_active' => 'boolean',
    ];

    public function exerciseType(): BelongsTo
    {
        return $this->belongsTo(ExerciseType::class);
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(TemplateAssignment::class, 'template_id');
    }

    public function answers(): HasMany
    {
        return $this->hasMany(Answer::class, 'template_id');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
