"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { NumberPad } from "@/components/NumberPad";
import { AnswerFeedback } from "@/components/AnswerFeedback";
import { generateArithmetic } from "@/lib/questions/mentalMath";
import { useDifficultyAdapter } from "@/hooks/useDifficultyAdapter";
import { api, type AnswerPayload } from "@/lib/api";

const TOTAL = 10;
const HINT_DELAY_MS = 10000;
const DEMO_CHILD_ID = 1;

export default function MentalMathPage() {
  const router = useRouter();
  const { currentLevel, recordAnswer } = useDifficultyAdapter(1);
  const [question, setQuestion] = useState(() => generateArithmetic(1));
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [answered, setAnswered] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<AnswerPayload[]>([]);
  const [startTime] = useState(Date.now());
  const [questionStart, setQuestionStart] = useState(Date.now());
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setShowHint(false);
    const t = setTimeout(() => setShowHint(true), HINT_DELAY_MS);
    return () => clearTimeout(t);
  }, [questionIndex]);

  const handleSubmit = useCallback((value: number) => {
    if (answered) return;
    setAnswered(true);
    const isCorrect = value === question.answer;
    setFeedback(isCorrect ? "correct" : "wrong");
    recordAnswer(isCorrect);

    const answer: AnswerPayload = {
      question_type: question.type,
      difficulty: question.difficulty,
      given_answer: String(value),
      is_correct: isCorrect,
      time_spent_ms: Date.now() - questionStart,
    };

    const newAnswers = [...answers, answer];
    const newScore = isCorrect ? score + 1 : score;

    setTimeout(() => {
      setFeedback(null);
      setAnswered(false);

      if (questionIndex + 1 >= TOTAL) {
        api.sessions.save({
          child_id: DEMO_CHILD_ID,
          module: "mental-math",
          score: newScore,
          total: TOTAL,
          duration: Math.round((Date.now() - startTime) / 1000),
          answers: newAnswers,
        }).catch(() => {});
        router.push("/");
        return;
      }

      setAnswers(newAnswers);
      setScore(newScore);
      setQuestionIndex((i) => i + 1);
      setQuestion(generateArithmetic(currentLevel));
      setQuestionStart(Date.now());
    }, 1200);
  }, [answered, question, questionIndex, score, answers, startTime, questionStart, currentLevel, recordAnswer, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-blue-50">
      <AnswerFeedback result={feedback} />

      {/* Header */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <button onClick={() => router.push("/")} className="text-2xl">←</button>
        <div className="text-center">
          <div className="text-sm text-gray-500">けいさん</div>
          <div className="text-xs text-gray-400">{questionIndex + 1} / {TOTAL}</div>
        </div>
        <div className="text-blue-600 font-bold">⭐ {score}</div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md h-2 bg-blue-100 rounded-full mb-8">
        <div
          className="h-2 bg-blue-400 rounded-full transition-all"
          style={{ width: `${(questionIndex / TOTAL) * 100}%` }}
        />
      </div>

      {/* Level badge */}
      <div className="mb-4 text-xs font-bold text-blue-400 uppercase tracking-widest">
        Level {currentLevel}
      </div>

      {/* Question display */}
      <div className="bg-white rounded-3xl shadow-xl px-12 py-8 mb-8 flex items-center justify-center min-w-[280px]">
        <span className="text-5xl font-black text-gray-800 tracking-wide">
          {question.display}
        </span>
      </div>

      {/* Hint */}
      {showHint && !answered && (
        <div className="mb-4 text-sm text-blue-500 bg-blue-100 rounded-xl px-4 py-2">
          こたえ: {question.answer}
        </div>
      )}

      <NumberPad onSubmit={handleSubmit} maxDigits={2} />
    </div>
  );
}
