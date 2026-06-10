<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Answer extends Model
{
    protected $fillable = [
        'session_id',
        'question_type',
        'difficulty',
        'given_answer',
        'is_correct',
        'time_spent_ms',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    public function session(): BelongsTo
    {
        return $this->belongsTo(LearningSession::class, 'session_id');
    }
}
