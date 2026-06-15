<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_challenge_configs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->nullable()->constrained('children')->nullOnDelete();
            $table->unsignedTinyInteger('number_sense_count')->default(3);
            $table->unsignedTinyInteger('mental_math_count')->default(4);
            $table->unsignedTinyInteger('story_math_count')->default(3);
            $table->unsignedSmallInteger('total_time_seconds')->default(300);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['child_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_challenge_configs');
    }
};
