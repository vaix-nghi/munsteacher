import type { QuestionTemplate } from "@/lib/api";
import { STORIES, type Story } from "@/data/stories";
import { generateArithmetic, type MathQuestion } from "./mentalMath";
import { generateNumberSense, type NumberSenseQuestion } from "./numberSense";

type RandomFn = () => number;

type NumberRange = { min: number; max: number };

const DEFAULT_STORY: Story = {
  id: "fallback-story",
  text_ja: "りんごが 3つ あります。2つ ふえました。ぜんぶで なんこ？",
  text_vi: "Có 3 quả táo. Thêm 2 quả nữa. Tất cả có bao nhiêu quả?",
  answer: 5,
  operation: "add",
  image: "apple",
  difficulty: 1,
};

export type GeneratedNumberSenseQuestion = {
  templateId?: number;
  difficulty: 1 | 2;
  question: NumberSenseQuestion;
};

export type GeneratedMentalMathQuestion = {
  templateId?: number;
  question: MathQuestion;
};

export type GeneratedStoryQuestion = {
  templateId?: number;
  story: Story;
  options?: number[];
};

function randomInt(min: number, max: number, rand: RandomFn = Math.random): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function shuffle<T>(items: T[], rand: RandomFn = Math.random): T[] {
  const values = [...items];
  for (let index = values.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rand() * (index + 1));
    [values[index], values[swapIndex]] = [values[swapIndex], values[index]];
  }
  return values;
}

function pickOne<T>(items: T[], rand: RandomFn = Math.random): T | undefined {
  if (items.length === 0) return undefined;
  return items[Math.floor(rand() * items.length)];
}

function toNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function toStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  const items = value.filter((item): item is string => typeof item === "string");
  return items.length > 0 ? items : fallback;
}

function toNumberArray(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is number => typeof item === "number" && Number.isFinite(item));
}

function answerRangeFromTemplate(template: QuestionTemplate, fallback: NumberRange): NumberRange {
  const possibleAnswers = template.possible_answers;
  if (possibleAnswers.type === "range") {
    return {
      min: toNumber(possibleAnswers.min, fallback.min),
      max: toNumber(possibleAnswers.max, fallback.max),
    };
  }
  return fallback;
}

function generateCountOptions(
  answer: number,
  template: QuestionTemplate,
  max: number,
  rand: RandomFn = Math.random
): number[] {
  const rules = template.rules;
  const optionCount = Math.max(2, toNumber(rules.options_count, 3));
  const range = answerRangeFromTemplate(template, { min: 1, max });
  const options = new Set<number>([answer]);

  for (let attempts = 0; options.size < optionCount && attempts < 100; attempts += 1) {
    options.add(randomInt(range.min, range.max, rand));
  }

  return shuffle(Array.from(options), rand);
}

function clampNumberSenseDifficulty(value: number): 1 | 2 {
  return value === 2 ? 2 : 1;
}

function clampMentalMathDifficulty(value: number): 1 | 2 | 3 {
  if (value === 2 || value === 3) return value;
  return 1;
}

function pickTemplate(
  templates: QuestionTemplate[],
  difficulty: number | undefined,
  rand: RandomFn = Math.random
): QuestionTemplate | undefined {
  const pool =
    difficulty === undefined
      ? templates
      : templates.filter((template) => template.difficulty === difficulty);
  const candidates = pool.length > 0 ? pool : templates;
  return pickOne(candidates, rand);
}

function buildStoryOptions(answer: number): number[] {
  return Array.from(new Set([answer - 2, answer - 1, answer, answer + 1, answer + 2])).filter(
    (value) => value > 0
  );
}

export function generateNumberSenseQuestion(
  templates: QuestionTemplate[] = [],
  preferredDifficulty?: 1 | 2,
  rand: RandomFn = Math.random
): GeneratedNumberSenseQuestion {
  const template = pickTemplate(templates, preferredDifficulty, rand);

  if (!template) {
    const difficulty = preferredDifficulty ?? 1;
    return {
      difficulty,
      question: generateNumberSense(difficulty),
    };
  }

  const rules = template.rules;
  const difficulty = clampNumberSenseDifficulty(template.difficulty);
  const min = toNumber(rules.min, 1);
  const max = toNumber(rules.max, difficulty === 1 ? 5 : 10);
  const emojiPool = toStringArray(rules.emoji_pool, ["🍎", "🚗", "⭐", "🐶", "🍭", "✏️", "🎈", "🌸"]);

  if (template.question_kind === "compare") {
    const leftCount = randomInt(min, max, rand);
    let rightCount = randomInt(min, max, rand);

    while (rightCount === leftCount) {
      rightCount = randomInt(min, max, rand);
    }

    return {
      templateId: template.id,
      difficulty,
      question: {
        type: "compare",
        left: { count: leftCount, emoji: pickOne(emojiPool, rand) ?? "🍎" },
        right: { count: rightCount, emoji: pickOne(emojiPool, rand) ?? "🍎" },
      },
    };
  }

  const count = randomInt(min, max, rand);

  return {
    templateId: template.id,
    difficulty,
    question: {
      type: "count",
      count,
      emoji: pickOne(emojiPool, rand) ?? "🍎",
      options: generateCountOptions(count, template, max, rand),
    },
  };
}

function generateAdditionQuestion(
  template: QuestionTemplate,
  rand: RandomFn = Math.random
): MathQuestion | null {
  const rules = template.rules;
  const difficulty = clampMentalMathDifficulty(template.difficulty);
  const operand1Min = toNumber(rules.operand1_min, 1);
  const operand1Max = toNumber(rules.operand1_max, 9);
  const operand2Min = toNumber(rules.operand2_min, 1);
  const operand2Max = toNumber(rules.operand2_max, 9);
  const resultMin = toNumber(rules.result_min, 2);
  const resultMax = toNumber(rules.result_max, 20);
  const carry = typeof rules.carry === "boolean" ? rules.carry : undefined;

  for (let attempts = 0; attempts < 100; attempts += 1) {
    const left = randomInt(operand1Min, operand1Max, rand);
    const right = randomInt(operand2Min, operand2Max, rand);
    const answer = left + right;

    if (answer < resultMin || answer > resultMax) continue;
    if (carry === true && answer <= 10) continue;
    if (carry === false && answer > 10) continue;

    return {
      display: `${left} + ${right} = ?`,
      answer,
      type: "add",
      difficulty,
    };
  }

  return null;
}

function generateSubtractionQuestion(
  template: QuestionTemplate,
  rand: RandomFn = Math.random
): MathQuestion | null {
  const rules = template.rules;
  const difficulty = clampMentalMathDifficulty(template.difficulty);
  const resultMin = toNumber(rules.result_min, 1);
  const resultMax = toNumber(rules.result_max, 10);
  const subtrahendMin = toNumber(rules.subtrahend_min, 1);
  const subtrahendMax = toNumber(rules.subtrahend_max, 9);
  const minuendMax = toNumber(rules.minuend_max, 20);

  for (let attempts = 0; attempts < 100; attempts += 1) {
    const answer = randomInt(resultMin, resultMax, rand);
    const subtrahend = randomInt(subtrahendMin, subtrahendMax, rand);
    const minuend = answer + subtrahend;

    if (minuend > minuendMax) continue;

    return {
      display: `${minuend} - ${subtrahend} = ?`,
      answer,
      type: "sub",
      difficulty,
    };
  }

  return null;
}

function generateMissingAdditionQuestion(
  template: QuestionTemplate,
  rand: RandomFn = Math.random
): MathQuestion | null {
  const rules = template.rules;
  const difficulty = clampMentalMathDifficulty(template.difficulty);
  const bMin = toNumber(rules.b_min, 1);
  const bMax = toNumber(rules.b_max, 9);
  const resultMin = toNumber(rules.result_min, 2);
  const resultMax = toNumber(rules.result_max, 20);
  const answerRange = answerRangeFromTemplate(template, { min: 1, max: 9 });

  for (let attempts = 0; attempts < 100; attempts += 1) {
    const right = randomInt(bMin, bMax, rand);
    const totalMin = Math.max(resultMin, right + answerRange.min);
    const totalMax = Math.min(resultMax, right + answerRange.max);

    if (totalMin > totalMax) continue;

    const total = randomInt(totalMin, totalMax, rand);
    const answer = total - right;

    return {
      display: `? + ${right} = ${total}`,
      answer,
      type: "add_missing",
      difficulty,
    };
  }

  return null;
}

function generateMissingSubtractionQuestion(
  template: QuestionTemplate,
  rand: RandomFn = Math.random
): MathQuestion | null {
  const rules = template.rules;
  const difficulty = clampMentalMathDifficulty(template.difficulty);
  const minuendMin = toNumber(rules.minuend_min, 2);
  const minuendMax = toNumber(rules.minuend_max, 20);
  const resultMin = toNumber(rules.result_min, 1);
  const answerRange = answerRangeFromTemplate(template, { min: 1, max: 19 });

  for (let attempts = 0; attempts < 100; attempts += 1) {
    const minuend = randomInt(minuendMin, minuendMax, rand);
    const resultUpperBound = Math.min(minuend - 1, minuend - answerRange.min);

    if (resultMin > resultUpperBound) continue;

    const result = randomInt(resultMin, resultUpperBound, rand);
    const answer = minuend - result;

    if (answer < answerRange.min || answer > answerRange.max) continue;

    return {
      display: `${minuend} - ? = ${result}`,
      answer,
      type: "sub_missing",
      difficulty,
    };
  }

  return null;
}

export function generateMentalMathQuestion(
  templates: QuestionTemplate[] = [],
  preferredDifficulty?: 1 | 2 | 3,
  rand: RandomFn = Math.random
): GeneratedMentalMathQuestion {
  const template = pickTemplate(templates, preferredDifficulty, rand);

  if (!template) {
    return {
      question: generateArithmetic(preferredDifficulty ?? 1),
    };
  }

  let question: MathQuestion | null = null;

  switch (template.question_kind) {
    case "add":
      question = generateAdditionQuestion(template, rand);
      break;
    case "sub":
      question = generateSubtractionQuestion(template, rand);
      break;
    case "add_missing":
      question = generateMissingAdditionQuestion(template, rand);
      break;
    case "sub_missing":
      question = generateMissingSubtractionQuestion(template, rand);
      break;
  }

  return {
    templateId: template.id,
    question: question ?? generateArithmetic(clampMentalMathDifficulty(template.difficulty)),
  };
}

export function generateStoryQuestion(
  templates: QuestionTemplate[] = [],
  rand: RandomFn = Math.random
): GeneratedStoryQuestion {
  const template = templates.length > 0 ? pickOne(templates, rand) : undefined;

  if (!template) {
    return {
      story: pickOne(STORIES, rand) ?? DEFAULT_STORY,
    };
  }

  const fallbackStory = STORIES.length > 0 ? STORIES[0] : DEFAULT_STORY;
  const rules = template.rules;
  const possibleAnswers = template.possible_answers;
  const answer = toNumber(possibleAnswers.correct, fallbackStory.answer);
  const options = toNumberArray(possibleAnswers.options);

  return {
    templateId: template.id,
    story: {
      id: `template-${template.id}`,
      text_ja: typeof rules.text_ja === "string" ? rules.text_ja : fallbackStory.text_ja,
      text_vi: typeof rules.text_vi === "string" ? rules.text_vi : fallbackStory.text_vi,
      answer,
      operation: rules.operation === "sub" ? "sub" : "add",
      image:
        rules.image === "candy" ||
        rules.image === "apple" ||
        rules.image === "pencil" ||
        rules.image === "ball" ||
        rules.image === "car" ||
        rules.image === "flower" ||
        rules.image === "star" ||
        rules.image === "cookie"
          ? rules.image
          : fallbackStory.image,
      difficulty: clampNumberSenseDifficulty(template.difficulty),
    },
    options: options.length > 0 ? options : buildStoryOptions(answer),
  };
}

export function generateStoryQuestionPool(
  templates: QuestionTemplate[] = [],
  count: number,
  rand: RandomFn = Math.random
): GeneratedStoryQuestion[] {
  return Array.from({ length: Math.max(0, count) }, () => generateStoryQuestion(templates, rand));
}
