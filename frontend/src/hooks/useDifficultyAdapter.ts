import { useEffect, useRef, useState } from "react";

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
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const recordAnswer = (isCorrect: boolean) => {
    const previous = stateRef.current;
    const correctStreak = isCorrect ? previous.correctStreak + 1 : 0;
    const wrongStreak = isCorrect ? 0 : previous.wrongStreak + 1;

    let level = previous.currentLevel;
    if (correctStreak >= 3 && level < 3) level = (level + 1) as 1 | 2 | 3;
    if (wrongStreak >= 2 && level > 1) level = (level - 1) as 1 | 2 | 3;

    const nextState = { currentLevel: level, correctStreak, wrongStreak };
    stateRef.current = nextState;
    setState(nextState);

    return level;
  };

  return { ...state, recordAnswer };
}
