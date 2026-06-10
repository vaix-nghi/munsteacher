"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { StoryCard } from "@/components/StoryCard";
import { AnswerFeedback } from "@/components/AnswerFeedback";
import { STORIES } from "@/data/stories";
import { api, type AnswerPayload } from "@/lib/api";

const TOTAL = 8;
const DEMO_CHILD_ID = 1;

function pickStories(count: number) {
  const shuffled = [...STORIES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function StoryMathPage() {
  const router = useRouter();
  const [storyPool] = useState(() => pickStories(TOTAL));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<AnswerPayload[]>([]);
  const [startTime] = useState(Date.now());
  const [questionStart, setQuestionStart] = useState(Date.now());

  const story = storyPool[questionIndex];

  const handleAnswer = useCallback((value: number) => {
    if (answered) return;
    setAnswered(true);
    const isCorrect = value === story.answer;
    setFeedback(isCorrect ? "correct" : "wrong");

    const answer: AnswerPayload = {
      question_type: story.operation,
      difficulty: story.difficulty,
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
          module: "story-math",
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
      setQuestionStart(Date.now());
    }, 1200);
  }, [answered, story, questionIndex, score, answers, startTime, questionStart, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-8 bg-purple-50">
      <AnswerFeedback result={feedback} />

      {/* Header */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <button onClick={() => router.push("/")} className="text-2xl">←</button>
        <div className="text-center">
          <div className="text-sm text-gray-500">もんだい</div>
          <div className="text-xs text-gray-400">{questionIndex + 1} / {TOTAL}</div>
        </div>
        <div className="text-purple-600 font-bold">⭐ {score}</div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md h-2 bg-purple-100 rounded-full mb-6">
        <div
          className="h-2 bg-purple-400 rounded-full transition-all"
          style={{ width: `${(questionIndex / TOTAL) * 100}%` }}
        />
      </div>

      <StoryCard story={story} onAnswer={handleAnswer} />
    </div>
  );
}
