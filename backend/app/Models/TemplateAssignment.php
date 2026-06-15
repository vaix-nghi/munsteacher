<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemplateAssignment extends Model
{
    protected $fillable = [
        'template_id',
        'child_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(QuestionTemplate::class, 'template_id');
    }

    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class);
    }
}
