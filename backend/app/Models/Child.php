<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Child extends Model
{
    protected $fillable = ['name', 'avatar'];

    public function learningSessions(): HasMany
    {
        return $this->hasMany(LearningSession::class);
    }

    public function progress(): HasMany
    {
        return $this->hasMany(Progress::class);
    }
}
