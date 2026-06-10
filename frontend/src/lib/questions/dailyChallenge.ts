import { generateNumberSense, type NumberSenseQuestion } from './numberSense';
import { generateArithmetic, type MathQuestion } from './mentalMath';
import { STORIES, type Story } from '@/data/stories';

export type DailyChallengeQuestion =
  | { source: 'number-sense'; q: NumberSenseQuestion }
  | { source: 'mental-math'; q: MathQuestion }
  | { source: 'story-math'; q: Story };

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
    source: 'number-sense' as const,
    q: generateNumberSense((rand() < 0.5 ? 1 : 2) as 1 | 2),
  }));

  const mentalMathQs: DailyChallengeQuestion[] = Array.from({ length: 4 }, () => ({
    source: 'mental-math' as const,
    q: generateArithmetic(([1, 1, 2, 3][Math.floor(rand() * 4)]) as 1 | 2 | 3),
  }));

  const shuffledStories = seededShuffle(STORIES, rand);
  const storyQs: DailyChallengeQuestion[] = shuffledStories.slice(0, 3).map((s) => ({
    source: 'story-math' as const,
    q: s,
  }));

  return seededShuffle([...numberSenseQs, ...mentalMathQs, ...storyQs], rand);
}
