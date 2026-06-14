<?php

namespace Tests\Feature;

use App\Models\Child;
use App\Models\DailyChallengeConfig;
use App\Models\ExerciseType;
use App\Models\QuestionTemplate;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TemplateManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(\Database\Seeders\QuestionTemplateSeeder::class);
    }

    public function test_it_lists_active_exercise_types(): void
    {
        $response = $this->getJson('/api/exercise-types');

        $response->assertOk()
            ->assertJsonCount(4)
            ->assertJsonPath('0.slug', 'number-sense')
            ->assertJsonPath('1.slug', 'mental-math');
    }

    public function test_it_returns_grade_templates_when_child_has_no_assignment(): void
    {
        $child = Child::create([
            'name' => 'Taro',
            'grade' => 1,
        ]);

        $response = $this->getJson("/api/children/{$child->id}/templates?exercise_type=number-sense");

        $response->assertOk()
            ->assertJsonCount(3)
            ->assertJsonPath('0.question_kind', 'count')
            ->assertJsonPath('2.question_kind', 'compare');
    }

    public function test_it_prefers_child_specific_assignments_for_requested_type(): void
    {
        $child = Child::create([
            'name' => 'Hanako',
            'grade' => 1,
        ]);

        $template = QuestionTemplate::query()
            ->where('question_kind', 'compare')
            ->firstOrFail();

        $this->postJson("/api/children/{$child->id}/template-assignments", [
            'template_id' => $template->id,
        ])->assertCreated();

        $response = $this->getJson("/api/children/{$child->id}/templates?exercise_type=number-sense");

        $response->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.id', $template->id)
            ->assertJsonPath('0.question_kind', 'compare');
    }

    public function test_it_returns_daily_setup_with_child_specific_config(): void
    {
        $child = Child::create([
            'name' => 'Ken',
            'grade' => 1,
        ]);

        DailyChallengeConfig::create([
            'child_id' => $child->id,
            'number_sense_count' => 2,
            'mental_math_count' => 5,
            'story_math_count' => 1,
            'total_time_seconds' => 180,
            'is_active' => true,
        ]);

        $response = $this->getJson("/api/children/{$child->id}/daily-setup");

        $response->assertOk()
            ->assertJsonPath('config.number_sense_count', 2)
            ->assertJsonPath('config.mental_math_count', 5)
            ->assertJsonCount(3, 'templates.number_sense')
            ->assertJsonCount(6, 'templates.mental_math')
            ->assertJsonCount(22, 'templates.story_math');
    }

    public function test_it_creates_and_toggles_question_templates(): void
    {
        $exerciseType = ExerciseType::query()->where('slug', 'mental-math')->firstOrFail();

        $createResponse = $this->postJson('/api/question-templates', [
            'exercise_type_id' => $exerciseType->id,
            'grade' => 1,
            'difficulty' => 4,
            'question_kind' => 'add',
            'generation_strategy' => 'rule_based',
            'rules' => ['operand1_min' => 1, 'operand1_max' => 20],
            'possible_answers' => ['type' => 'range', 'min' => 1, 'max' => 20],
            'sort_order' => 99,
            'is_active' => true,
        ]);

        $templateId = $createResponse->json('id');

        $createResponse->assertCreated()
            ->assertJsonPath('exercise_type.slug', 'mental-math');

        $this->patchJson("/api/question-templates/{$templateId}/toggle")
            ->assertOk()
            ->assertJsonPath('is_active', false);
    }
}
