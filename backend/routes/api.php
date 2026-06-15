<?php

use App\Http\Controllers\Api\ChildController;
use App\Http\Controllers\Api\ChildTemplateController;
use App\Http\Controllers\Api\DailyChallengeConfigController;
use App\Http\Controllers\Api\DailySetupController;
use App\Http\Controllers\Api\ExerciseTypeController;
use App\Http\Controllers\Api\ProgressController;
use App\Http\Controllers\Api\QuestionTemplateController;
use App\Http\Controllers\Api\SessionController;
use App\Http\Controllers\Api\TemplateAssignmentController;
use Illuminate\Support\Facades\Route;

Route::get('health', fn () => response()->json([
    'status' => 'ok',
    'service' => 'munsteacher-backend',
]));

Route::get('exercise-types', [ExerciseTypeController::class, 'index']);

Route::get('children', [ChildController::class, 'index']);
Route::post('children', [ChildController::class, 'store']);
Route::get('children/{child}', [ChildController::class, 'show']);
Route::get('children/{child}/templates', [ChildTemplateController::class, 'index']);
Route::get('children/{child}/daily-setup', [DailySetupController::class, 'show']);
Route::get('children/{child}/daily-config', [DailyChallengeConfigController::class, 'show']);
Route::put('children/{child}/daily-config', [DailyChallengeConfigController::class, 'update']);
Route::delete('children/{child}/daily-config', [DailyChallengeConfigController::class, 'destroy']);
Route::get('children/{child}/template-assignments', [TemplateAssignmentController::class, 'index']);
Route::post('children/{child}/template-assignments', [TemplateAssignmentController::class, 'store']);
Route::delete('children/{child}/template-assignments/{assignmentId}', [TemplateAssignmentController::class, 'destroy']);

Route::get('question-templates', [QuestionTemplateController::class, 'index']);
Route::post('question-templates', [QuestionTemplateController::class, 'store']);
Route::get('question-templates/{questionTemplate}', [QuestionTemplateController::class, 'show']);
Route::put('question-templates/{questionTemplate}', [QuestionTemplateController::class, 'update']);
Route::patch('question-templates/{questionTemplate}/toggle', [QuestionTemplateController::class, 'toggle']);

Route::put('daily-config/default', [DailyChallengeConfigController::class, 'updateDefault']);

Route::post('sessions', [SessionController::class, 'store']);
Route::get('sessions', [SessionController::class, 'index']);

Route::get('progress/{childId}', [ProgressController::class, 'show']);
