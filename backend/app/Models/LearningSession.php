<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LearningSession extends Model
{
    protected $table = 'learning_sessions';

    protected $fillable = ['child_id', 'module', 'score', 'total', 'duration'];

    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(Answer::class, 'session_id');
    }
}
