<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('template_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained('question_templates')->cascadeOnDelete();
            $table->foreignId('child_id')->constrained('children')->cascadeOnDelete();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['template_id', 'child_id']);
            $table->index(['child_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('template_assignments');
    }
};
