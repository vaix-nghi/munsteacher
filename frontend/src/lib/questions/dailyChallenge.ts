import type { DailySetupResponse } from "@/lib/api";
import { generateArithmetic, type MathQuestion } from "./mentalMath";
import {
  generateMentalMathQuestion,
  generateNumberSenseQuestion,
  generateStoryQuestionPool,
} from "./templateBased";
import { generateNumberSense, type NumberSenseQuestion } from "./numberSense";
import { STORIES, type Story } from "@/data/stories";

export type DailyChallengeQuestion =
  | { source: "number-sense"; q: NumberSenseQuestion; templateId?: number; difficulty?: 1 | 2 }
  | { source: "mental-math"; q: MathQuestion; templateId?: number }
  | { source: "story-math"; q: Story; templateId?: number; options?: number[] };

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function dateToSeed(date: Date): number {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

function seededShuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateDailyChallenge(date?: Date): DailyChallengeQuestion[] {
  const seed = dateToSeed(date ?? new Date());
  const rand = seededRandom(seed);

  const numberSenseQs: DailyChallengeQuestion[] = Array.from({ length: 3 }, () => ({
    source: "number-sense" as const,
    q: generateNumberSense((rand() < 0.5 ? 1 : 2) as 1 | 2),
  }));

  const mentalMathQs: DailyChallengeQuestion[] = Array.from({ length: 4 }, () => ({
    source: "mental-math" as const,
    q: generateArithmetic(([1, 1, 2, 3][Math.floor(rand() * 4)]) as 1 | 2 | 3),
  }));

  const shuffledStories = seededShuffle(STORIES, rand);
  const storyQs: DailyChallengeQuestion[] = shuffledStories.slice(0, 3).map((s) => ({
    source: "story-math" as const,
    q: s,
  }));

  return seededShuffle([...numberSenseQs, ...mentalMathQs, ...storyQs], rand);
}

export function generateDailyChallengeFromSetup(
  setup: DailySetupResponse,
  date?: Date
): DailyChallengeQuestion[] {
  const seed = dateToSeed(date ?? new Date());
  const rand = seededRandom(seed);

  const numberSenseQs: DailyChallengeQuestion[] = Array.from(
    { length: setup.config.number_sense_count },
    () => {
      const generated = generateNumberSenseQuestion(setup.templates.number_sense, undefined, rand);
      return {
        source: "number-sense" as const,
        q: generated.question,
        templateId: generated.templateId,
        difficulty: generated.difficulty,
      };
    }
  );

  const mentalMathQs: DailyChallengeQuestion[] = Array.from(
    { length: setup.config.mental_math_count },
    () => {
      const generated = generateMentalMathQuestion(setup.templates.mental_math, undefined, rand);
      return {
        source: "mental-math" as const,
        q: generated.question,
        templateId: generated.templateId,
      };
    }
  );

  const storyQs: DailyChallengeQuestion[] = generateStoryQuestionPool(
    setup.templates.story_math,
    setup.config.story_math_count,
    rand
  ).map((generated) => ({
    source: "story-math" as const,
    q: generated.story,
    templateId: generated.templateId,
    options: generated.options,
  }));

  return seededShuffle([...numberSenseQs, ...mentalMathQs, ...storyQs], rand);
}
