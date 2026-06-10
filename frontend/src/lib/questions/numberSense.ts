const EMOJIS = ['🍎', '🚗', '⭐', '🐶', '🍭', '✏️', '🎈', '🌸'] as const;

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickEmoji(): string {
  return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
}

function generateOptions(answer: number, max: number): number[] {
  const options = new Set<number>([answer]);
  while (options.size < 3) {
    const offset = randomInt(1, 3) * (Math.random() < 0.5 ? 1 : -1);
    const candidate = answer + offset;
    if (candidate >= 1 && candidate <= max) {
      options.add(candidate);
    }
  }
  return Array.from(options).sort(() => Math.random() - 0.5);
}

export type NumberSenseQuestion =
  | { type: 'count'; count: number; emoji: string; options: number[] }
  | { type: 'compare'; left: { count: number; emoji: string }; right: { count: number; emoji: string } };

export function generateNumberSense(difficulty: 1 | 2): NumberSenseQuestion {
  const useCompare = difficulty === 2 && Math.random() < 0.4;

  if (useCompare) {
    const leftCount = randomInt(1, 10);
    let rightCount = randomInt(1, 10);
    while (rightCount === leftCount) rightCount = randomInt(1, 10);
    return {
      type: 'compare',
      left: { count: leftCount, emoji: pickEmoji() },
      right: { count: rightCount, emoji: pickEmoji() },
    };
  }

  const max = difficulty === 1 ? 5 : 10;
  const count = randomInt(1, max);
  return {
    type: 'count',
    count,
    emoji: pickEmoji(),
    options: generateOptions(count, max),
  };
}
