import { useState } from "react";

type State = {
  currentLevel: 1 | 2 | 3;
  correctStreak: number;
  wrongStreak: number;
};

export function useDifficultyAdapter(initial: 1 | 2 | 3 = 1) {
  const [state, setState] = useState<State>({
    currentLevel: initial,
    correctStreak: 0,
    wrongStreak: 0,
  });

  const recordAnswer = (isCorrect: boolean) => {
    let nextLevel = state.currentLevel;

    setState((prev) => {
      const correctStreak = isCorrect ? prev.correctStreak + 1 : 0;
      const wrongStreak = isCorrect ? 0 : prev.wrongStreak + 1;

      let level = prev.currentLevel;
      if (correctStreak >= 3 && level < 3) level = (level + 1) as 1 | 2 | 3;
      if (wrongStreak >= 2 && level > 1) level = (level - 1) as 1 | 2 | 3;
      nextLevel = level;

      return { currentLevel: level, correctStreak, wrongStreak };
    });

    return nextLevel;
  };

  return { ...state, recordAnswer };
}
