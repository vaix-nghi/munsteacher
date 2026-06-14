"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { NumberPad } from "@/components/NumberPad";
import { AnswerFeedback } from "@/components/AnswerFeedback";
import { useDifficultyAdapter } from "@/hooks/useDifficultyAdapter";
import { api, type AnswerPayload } from "@/lib/api";
import {
  generateMentalMathQuestion,
  type GeneratedMentalMathQuestion,
} from "@/lib/questions/templateBased";

const TOTAL = 10;
const HINT_DELAY_MS = 10000;
const DEMO_CHILD_ID = 1;

export default function MentalMathPage() {
  const router = useRouter();
  const { currentLevel, recordAnswer } = useDifficultyAdapter(1);
  const { data: templates, isError } = useQuery({
    queryKey: ["templates", DEMO_CHILD_ID, "mental-math"],
    queryFn: () => api.children.getTemplates(DEMO_CHILD_ID, "mental-math"),
    retry: false,
    refetchOnWindowFocus: false,
  });
  const [currentQuestion, setCurrentQuestion] = useState<GeneratedMentalMathQuestion | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [answered, setAnswered] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<AnswerPayload[]>([]);
  const [startTime] = useState(Date.now());
  const [questionStart, setQuestionStart] = useState(Date.now());
  const [showHint, setShowHint] = useState(false);

  const nextQuestion = useCallback(
    (difficulty: 1 | 2 | 3) => generateMentalMathQuestion(templates ?? [], difficulty),
    [templates]
  );

  useEffect(() => {
    if (templates || isError) {
      setCurrentQuestion(nextQuestion(1));
      setQuestionStart(Date.now());
    }
  }, [templates, isError, nextQuestion]);

  useEffect(() => {
    setShowHint(false);
    const t = setTimeout(() => setShowHint(true), HINT_DELAY_MS);
    return () => clearTimeout(t);
  }, [questionIndex]);

  const handleSubmit = useCallback((value: number) => {
    if (answered || !currentQuestion) return;
    setAnswered(true);
    const isCorrect = value === currentQuestion.question.answer;
    setFeedback(isCorrect ? "correct" : "wrong");
    const nextLevel = recordAnswer(isCorrect);

    const answer: AnswerPayload = {
      template_id: currentQuestion.templateId,
      question_type: currentQuestion.question.type,
      difficulty: currentQuestion.question.difficulty,
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
      setCurrentQuestion(nextQuestion(nextLevel));
      setQuestionStart(Date.now());
    }, 1200);
  }, [answered, currentQuestion, questionIndex, score, answers, startTime, questionStart, recordAnswer, router, nextQuestion]);

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50 text-blue-600 font-bold">
        よみこみちゅう...
      </div>
    );
  }

  const question = currentQuestion.question;

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
