<?php

namespace Database\Seeders;

use App\Models\DailyChallengeConfig;
use App\Models\ExerciseType;
use App\Models\QuestionTemplate;
use App\Models\TemplateAssignment;
use Illuminate\Database\Seeder;

class QuestionTemplateSeeder extends Seeder
{
    private const EMOJIS = ['🍎', '🚗', '⭐', '🐶', '🍭', '✏️', '🎈', '🌸'];

    public function run(): void
    {
        TemplateAssignment::query()->delete();
        QuestionTemplate::query()->delete();
        DailyChallengeConfig::query()->delete();
        ExerciseType::query()->delete();

        $exerciseTypes = collect([
            ['slug' => 'number-sense', 'name_ja' => 'かずのかんかく', 'name_vi' => 'Cảm nhận số', 'sort_order' => 1],
            ['slug' => 'mental-math', 'name_ja' => 'けいさん', 'name_vi' => 'Tính nhẩm', 'sort_order' => 2],
            ['slug' => 'story-math', 'name_ja' => 'ぶんしょうだい', 'name_vi' => 'Toán có lời văn', 'sort_order' => 3],
            ['slug' => 'daily', 'name_ja' => 'まいにちチャレンジ', 'name_vi' => 'Thử thách hằng ngày', 'sort_order' => 4],
        ])->mapWithKeys(function (array $type) {
            $record = ExerciseType::create(array_merge($type, ['is_active' => true]));

            return [$record->slug => $record];
        });

        $numberSenseTypeId = $exerciseTypes['number-sense']->id;
        $mentalMathTypeId = $exerciseTypes['mental-math']->id;
        $storyMathTypeId = $exerciseTypes['story-math']->id;

        $templates = [
            [
                'exercise_type_id' => $numberSenseTypeId,
                'grade' => 1,
                'difficulty' => 1,
                'question_kind' => 'count',
                'generation_strategy' => 'rule_based',
                'rules' => [
                    'min' => 1,
                    'max' => 5,
                    'emoji_pool' => self::EMOJIS,
                    'options_count' => 3,
                ],
                'possible_answers' => ['type' => 'range', 'min' => 1, 'max' => 5],
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'exercise_type_id' => $numberSenseTypeId,
                'grade' => 1,
                'difficulty' => 2,
                'question_kind' => 'count',
                'generation_strategy' => 'rule_based',
                'rules' => [
                    'min' => 1,
                    'max' => 10,
                    'emoji_pool' => self::EMOJIS,
                    'options_count' => 3,
                ],
                'possible_answers' => ['type' => 'range', 'min' => 1, 'max' => 10],
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'exercise_type_id' => $numberSenseTypeId,
                'grade' => 1,
                'difficulty' => 2,
                'question_kind' => 'compare',
                'generation_strategy' => 'rule_based',
                'rules' => [
                    'min' => 1,
                    'max' => 10,
                    'emoji_pool' => self::EMOJIS,
                ],
                'possible_answers' => ['type' => 'enum', 'values' => ['left', 'right']],
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'exercise_type_id' => $mentalMathTypeId,
                'grade' => 1,
                'difficulty' => 1,
                'question_kind' => 'add',
                'generation_strategy' => 'rule_based',
                'rules' => [
                    'operand1_min' => 1,
                    'operand1_max' => 9,
                    'operand2_min' => 1,
                    'operand2_max' => 9,
                    'result_max' => 10,
                    'carry' => false,
                ],
                'possible_answers' => ['type' => 'range', 'min' => 2, 'max' => 10],
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'exercise_type_id' => $mentalMathTypeId,
                'grade' => 1,
                'difficulty' => 1,
                'question_kind' => 'sub',
                'generation_strategy' => 'rule_based',
                'rules' => [
                    'result_min' => 1,
                    'result_max' => 9,
                    'subtrahend_min' => 1,
                    'subtrahend_max' => 9,
                    'minuend_max' => 10,
                ],
                'possible_answers' => ['type' => 'range', 'min' => 1, 'max' => 9],
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'exercise_type_id' => $mentalMathTypeId,
                'grade' => 1,
                'difficulty' => 2,
                'question_kind' => 'add',
                'generation_strategy' => 'rule_based',
                'rules' => [
                    'operand1_min' => 2,
                    'operand1_max' => 9,
                    'operand2_min' => 2,
                    'operand2_max' => 9,
                    'result_min' => 11,
                    'result_max' => 18,
                    'carry' => true,
                ],
                'possible_answers' => ['type' => 'range', 'min' => 11, 'max' => 18],
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'exercise_type_id' => $mentalMathTypeId,
                'grade' => 1,
                'difficulty' => 2,
                'question_kind' => 'sub',
                'generation_strategy' => 'rule_based',
                'rules' => [
                    'result_min' => 1,
                    'result_max' => 10,
                    'subtrahend_min' => 1,
                    'subtrahend_max' => 9,
                    'minuend_max' => 20,
                ],
                'possible_answers' => ['type' => 'range', 'min' => 1, 'max' => 10],
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'exercise_type_id' => $mentalMathTypeId,
                'grade' => 1,
                'difficulty' => 3,
                'question_kind' => 'add_missing',
                'generation_strategy' => 'rule_based',
                'rules' => [
                    'b_min' => 1,
                    'b_max' => 9,
                    'result_min' => 2,
                    'result_max' => 20,
                ],
                'possible_answers' => ['type' => 'range', 'min' => 1, 'max' => 9],
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'exercise_type_id' => $mentalMathTypeId,
                'grade' => 1,
                'difficulty' => 3,
                'question_kind' => 'sub_missing',
                'generation_strategy' => 'rule_based',
                'rules' => [
                    'minuend_min' => 2,
                    'minuend_max' => 20,
                    'result_min' => 1,
                ],
                'possible_answers' => ['type' => 'range', 'min' => 1, 'max' => 19],
                'sort_order' => 6,
                'is_active' => true,
            ],
        ];

        foreach ($templates as $template) {
            QuestionTemplate::create($template);
        }

        foreach ($this->stories() as $index => $story) {
            QuestionTemplate::create([
                'exercise_type_id' => $storyMathTypeId,
                'grade' => 1,
                'difficulty' => $story['difficulty'],
                'question_kind' => 'story',
                'generation_strategy' => 'static',
                'rules' => [
                    'text_ja' => $story['text_ja'],
                    'text_vi' => $story['text_vi'],
                    'image' => $story['image'],
                    'operation' => $story['operation'],
                ],
                'possible_answers' => [
                    'type' => 'enum',
                    'correct' => $story['answer'],
                    'options' => $this->storyOptions($story['answer']),
                ],
                'sort_order' => $index + 1,
                'is_active' => true,
            ]);
        }

        DailyChallengeConfig::updateOrCreate(
            ['child_id' => null],
            [
                'number_sense_count' => 3,
                'mental_math_count' => 4,
                'story_math_count' => 3,
                'total_time_seconds' => 300,
                'is_active' => true,
            ]
        );
    }

    private function storyOptions(int $answer): array
    {
        return collect(range($answer - 2, $answer + 2))
            ->filter(fn (int $value) => $value > 0)
            ->unique()
            ->values()
            ->all();
    }

    private function stories(): array
    {
        return [
            ['text_ja' => 'たろうくんは キャンディを 3つ もっています。おかあさんに 2つ もらいました。ぜんぶで なんこ？', 'text_vi' => 'Taro có 3 cái kẹo. Mẹ cho thêm 2 cái. Taro có tất cả bao nhiêu cái?', 'answer' => 5, 'operation' => 'add', 'image' => 'candy', 'difficulty' => 1],
            ['text_ja' => 'はなこさんは りんごを 4つ もっています。ともだちに 3つ もらいました。ぜんぶで なんこ？', 'text_vi' => 'Hanako có 4 quả táo. Bạn cho thêm 3 quả. Hanako có tất cả bao nhiêu quả?', 'answer' => 7, 'operation' => 'add', 'image' => 'apple', 'difficulty' => 1],
            ['text_ja' => 'えんぴつが 2ほん あります。せんせいに 5ほん もらいました。ぜんぶで なんぼん？', 'text_vi' => 'Có 2 cây bút chì. Cô giáo cho thêm 5 cây. Tất cả có bao nhiêu cây?', 'answer' => 7, 'operation' => 'add', 'image' => 'pencil', 'difficulty' => 1],
            ['text_ja' => 'ボールが 1つ あります。ともだちが 4つ もってきました。ぜんぶで なんこ？', 'text_vi' => 'Có 1 quả bóng. Bạn mang thêm 4 quả. Tất cả có bao nhiêu quả?', 'answer' => 5, 'operation' => 'add', 'image' => 'ball', 'difficulty' => 1],
            ['text_ja' => 'こうえんに くるまが 3だい あります。あと 2だい きました。ぜんぶで なんだい？', 'text_vi' => 'Ở công viên có 3 ô tô. Thêm 2 ô tô nữa đến. Tất cả có bao nhiêu ô tô?', 'answer' => 5, 'operation' => 'add', 'image' => 'car', 'difficulty' => 1],
            ['text_ja' => 'はなが 4ほん あります。にわに 4ほん さいています。ぜんぶで なんぼん？', 'text_vi' => 'Có 4 bông hoa. Trong vườn có thêm 4 bông. Tất cả có bao nhiêu bông?', 'answer' => 8, 'operation' => 'add', 'image' => 'flower', 'difficulty' => 1],
            ['text_ja' => 'キャンディが 8つ あります。3つ たべました。のこりは なんこ？', 'text_vi' => 'Có 8 cái kẹo. Ăn mất 3 cái. Còn lại bao nhiêu cái?', 'answer' => 5, 'operation' => 'sub', 'image' => 'candy', 'difficulty' => 1],
            ['text_ja' => 'りんごが 9つ あります。5つ たべました。のこりは なんこ？', 'text_vi' => 'Có 9 quả táo. Ăn mất 5 quả. Còn lại bao nhiêu quả?', 'answer' => 4, 'operation' => 'sub', 'image' => 'apple', 'difficulty' => 1],
            ['text_ja' => 'ほしが 7つ あります。2つ きえました。のこりは なんこ？', 'text_vi' => 'Có 7 ngôi sao. 2 ngôi tắt mất. Còn lại bao nhiêu ngôi?', 'answer' => 5, 'operation' => 'sub', 'image' => 'star', 'difficulty' => 1],
            ['text_ja' => 'クッキーが 10まい あります。4まい たべました。のこりは なんまい？', 'text_vi' => 'Có 10 cái bánh quy. Ăn mất 4 cái. Còn lại bao nhiêu cái?', 'answer' => 6, 'operation' => 'sub', 'image' => 'cookie', 'difficulty' => 1],
            ['text_ja' => 'ボールが 6つ あります。2つ なくなりました。のこりは なんこ？', 'text_vi' => 'Có 6 quả bóng. Mất đi 2 quả. Còn lại bao nhiêu quả?', 'answer' => 4, 'operation' => 'sub', 'image' => 'ball', 'difficulty' => 1],
            ['text_ja' => 'えんぴつが 8ほん あります。3ほん なくなりました。のこりは なんぼん？', 'text_vi' => 'Có 8 cây bút chì. Mất đi 3 cây. Còn lại bao nhiêu cây?', 'answer' => 5, 'operation' => 'sub', 'image' => 'pencil', 'difficulty' => 1],
            ['text_ja' => 'はなこさんは ほしを 8つ もっています。ともだちに 7つ もらいました。ぜんぶで なんこ？', 'text_vi' => 'Hanako có 8 ngôi sao. Bạn cho thêm 7 ngôi. Hanako có tất cả bao nhiêu ngôi?', 'answer' => 15, 'operation' => 'add', 'image' => 'star', 'difficulty' => 2],
            ['text_ja' => 'クッキーが 9まい あります。おかあさんが 8まい やいてくれました。ぜんぶで なんまい？', 'text_vi' => 'Có 9 cái bánh quy. Mẹ nướng thêm 8 cái. Tất cả có bao nhiêu cái?', 'answer' => 17, 'operation' => 'add', 'image' => 'cookie', 'difficulty' => 2],
            ['text_ja' => 'くるまが 7だい あります。あと 9だい きました。ぜんぶで なんだい？', 'text_vi' => 'Có 7 ô tô. Thêm 9 ô tô nữa đến. Tất cả có bao nhiêu ô tô?', 'answer' => 16, 'operation' => 'add', 'image' => 'car', 'difficulty' => 2],
            ['text_ja' => 'えんぴつが 6ほん あります。せんせいに 8ほん もらいました。ぜんぶで なんぼん？', 'text_vi' => 'Có 6 cây bút chì. Cô giáo cho thêm 8 cây. Tất cả có bao nhiêu cây?', 'answer' => 14, 'operation' => 'add', 'image' => 'pencil', 'difficulty' => 2],
            ['text_ja' => 'りんごが 15こ あります。6こ たべました。のこりは なんこ？', 'text_vi' => 'Có 15 quả táo. Ăn mất 6 quả. Còn lại bao nhiêu quả?', 'answer' => 9, 'operation' => 'sub', 'image' => 'apple', 'difficulty' => 2],
            ['text_ja' => 'キャンディが 18こ あります。9こ たべました。のこりは なんこ？', 'text_vi' => 'Có 18 cái kẹo. Ăn mất 9 cái. Còn lại bao nhiêu cái?', 'answer' => 9, 'operation' => 'sub', 'image' => 'candy', 'difficulty' => 2],
            ['text_ja' => 'はなが 20ほん あります。7ほん つまれました。のこりは なんぼん？', 'text_vi' => 'Có 20 bông hoa. Hái mất 7 bông. Còn lại bao nhiêu bông?', 'answer' => 13, 'operation' => 'sub', 'image' => 'flower', 'difficulty' => 2],
            ['text_ja' => 'ボールが 16こ あります。8こ なくなりました。のこりは なんこ？', 'text_vi' => 'Có 16 quả bóng. Mất đi 8 quả. Còn lại bao nhiêu quả?', 'answer' => 8, 'operation' => 'sub', 'image' => 'ball', 'difficulty' => 2],
            ['text_ja' => 'ほしが 12こ あります。5こ きえました。のこりは なんこ？', 'text_vi' => 'Có 12 ngôi sao. 5 ngôi tắt mất. Còn lại bao nhiêu ngôi?', 'answer' => 7, 'operation' => 'sub', 'image' => 'star', 'difficulty' => 2],
            ['text_ja' => 'クッキーが 14まい あります。6まい たべました。のこりは なんまい？', 'text_vi' => 'Có 14 cái bánh quy. Ăn mất 6 cái. Còn lại bao nhiêu cái?', 'answer' => 8, 'operation' => 'sub', 'image' => 'cookie', 'difficulty' => 2],
        ];
    }
}
