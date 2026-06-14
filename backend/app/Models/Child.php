<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Child extends Model
{
    protected $fillable = ['name', 'avatar', 'grade'];

    public function learningSessions(): HasMany
    {
        return $this->hasMany(LearningSession::class);
    }

    public function progress(): HasMany
    {
        return $this->hasMany(Progress::class);
    }

    public function templateAssignments(): HasMany
    {
        return $this->hasMany(TemplateAssignment::class);
    }

    public function dailyChallengeConfig(): HasOne
    {
        return $this->hasOne(DailyChallengeConfig::class);
    }
}
