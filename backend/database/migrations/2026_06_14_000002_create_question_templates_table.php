<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('question_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exercise_type_id')->constrained('exercise_types')->cascadeOnDelete();
            $table->unsignedTinyInteger('grade')->default(1);
            $table->unsignedTinyInteger('difficulty');
            $table->string('question_kind', 30);
            $table->enum('generation_strategy', ['rule_based', 'static']);
            $table->json('rules');
            $table->json('possible_answers');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['exercise_type_id', 'grade', 'difficulty', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('question_templates');
    }
};
