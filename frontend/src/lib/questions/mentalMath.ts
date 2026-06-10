function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export type MathQuestion = {
  display: string;
  answer: number;
  type: 'add' | 'sub' | 'add_missing' | 'sub_missing';
  difficulty: 1 | 2 | 3;
};

export function generateArithmetic(difficulty: 1 | 2 | 3): MathQuestion {
  if (difficulty === 1) {
    const useAdd = Math.random() < 0.5;
    if (useAdd) {
      const a = randomInt(1, 9);
      const b = randomInt(1, 10 - a);
      return { display: `${a} + ${b} = ?`, answer: a + b, type: 'add', difficulty };
    } else {
      const answer = randomInt(1, 9);
      const b = randomInt(1, 10 - answer);
      const a = answer + b;
      return { display: `${a} - ${b} = ?`, answer, type: 'sub', difficulty };
    }
  }

  if (difficulty === 2) {
    const useAdd = Math.random() < 0.5;
    if (useAdd) {
      // addition with carrying (繰り上がり): a + b > 10, result ≤ 20
      const a = randomInt(2, 9);
      const b = randomInt(10 - a + 1, Math.min(9, 20 - a));
      if (b < 1) return generateArithmetic(1);
      return { display: `${a} + ${b} = ?`, answer: a + b, type: 'add', difficulty };
    } else {
      const answer = randomInt(1, 10);
      const b = randomInt(1, 9);
      const a = answer + b;
      if (a > 20) return generateArithmetic(2);
      return { display: `${a} - ${b} = ?`, answer, type: 'sub', difficulty };
    }
  }

  // difficulty === 3: missing number problems
  const useMissingAdd = Math.random() < 0.5;
  if (useMissingAdd) {
    const b = randomInt(1, 9);
    const c = randomInt(b + 1, Math.min(b + 9, 20));
    const a = c - b;
    return { display: `? + ${b} = ${c}`, answer: a, type: 'add_missing', difficulty };
  } else {
    const a = randomInt(2, 20);
    const c = randomInt(1, a - 1);
    const b = a - c;
    return { display: `${a} - ? = ${c}`, answer: b, type: 'sub_missing', difficulty };
  }
}
