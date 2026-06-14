<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyChallengeConfig extends Model
{
    protected $fillable = [
        'child_id',
        'number_sense_count',
        'mental_math_count',
        'story_math_count',
        'total_time_seconds',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class);
    }

    public static function resolveForChild(Child $child): self
    {
        $childSpecificConfig = static::query()
            ->where('child_id', $child->id)
            ->where('is_active', true)
            ->latest('id')
            ->first();

        if ($childSpecificConfig !== null) {
            return $childSpecificConfig;
        }

        return static::query()
            ->whereNull('child_id')
            ->where('is_active', true)
            ->latest('id')
            ->first() ?? new self([
                'child_id' => null,
                'number_sense_count' => 3,
                'mental_math_count' => 4,
                'story_math_count' => 3,
                'total_time_seconds' => 300,
                'is_active' => true,
            ]);
    }
}
