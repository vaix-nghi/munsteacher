"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  generateDailyChallenge,
  generateDailyChallengeFromSetup,
  type DailyChallengeQuestion,
} from "@/lib/questions/dailyChallenge";
import { ObjectDisplay } from "@/components/ObjectDisplay";
import { NumberPad } from "@/components/NumberPad";
import { StoryCard } from "@/components/StoryCard";
import { AnswerFeedback } from "@/components/AnswerFeedback";
import { CountdownTimer } from "@/components/CountdownTimer";
import { ResultScreen } from "@/components/ResultScreen";
import { api, type AnswerPayload } from "@/lib/api";

const TOTAL_TIME = 300; // 5 minutes
const DEMO_CHILD_ID = 1;

export default function DailyChallengePage() {
  const router = useRouter();
  const { data: dailySetup, isError } = useQuery({
    queryKey: ["daily-setup", DEMO_CHILD_ID],
    queryFn: () => api.children.getDailySetup(DEMO_CHILD_ID),
    retry: false,
    refetchOnWindowFocus: false,
  });
  const questions = useMemo<DailyChallengeQuestion[] | null>(() => {
    if (dailySetup) return generateDailyChallengeFromSetup(dailySetup);
    if (isError) return generateDailyChallenge();
    return null;
  }, [dailySetup, isError]);
  const totalTime = dailySetup?.config.total_time_seconds ?? TOTAL_TIME;
  const [questionIndex, setQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<AnswerPayload[]>([]);
  const [startTime] = useState(Date.now());
  const [questionStart, setQuestionStart] = useState(Date.now());
  const [remainingSeconds, setRemainingSeconds] = useState(totalTime);
  const [done, setDone] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    setRemainingSeconds(totalTime);
  }, [totalTime]);

  if (!questions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50 text-yellow-700 font-bold">
        よみこみちゅう...
      </div>
    );
  }

  const total = questions.length;

  // Tick the countdown
  useEffect(() => {
    if (done) return;
    const interval = setInterval(() => {
      setRemainingSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [done]);

  const finishSession = useCallback((currentScore: number, currentAnswers: AnswerPayload[]) => {
    if (done) return;
    setDone(true);
    setFinalScore(currentScore);
    api.sessions.save({
      child_id: DEMO_CHILD_ID,
      module: "daily",
      score: currentScore,
      total,
      duration: Math.round((Date.now() - startTime) / 1000),
      answers: currentAnswers,
    }).catch(() => {});
  }, [done, total, startTime]);

  const handleTimeUp = useCallback(() => {
    finishSession(score, answers);
  }, [finishSession, score, answers]);

  const handleAnswer = useCallback((value: string, isCorrect: boolean) => {
    if (answered || done) return;
    setAnswered(true);
    setFeedback(isCorrect ? "correct" : "wrong");

    const q = questions[questionIndex];
    const answer: AnswerPayload = {
      template_id: q.templateId,
      question_type: q.source,
      difficulty:
        q.source === "story-math"
          ? q.q.difficulty
          : q.source === "mental-math"
            ? q.q.difficulty
            : q.difficulty ?? 1,
      given_answer: value,
      is_correct: isCorrect,
      time_spent_ms: Date.now() - questionStart,
    };

    const newAnswers = [...answers, answer];
    const newScore = isCorrect ? score + 1 : score;

    setTimeout(() => {
      setFeedback(null);
      setAnswered(false);

      if (questionIndex + 1 >= total) {
        finishSession(newScore, newAnswers);
        return;
      }

      setAnswers(newAnswers);
      setScore(newScore);
      setQuestionIndex((i) => i + 1);
      setQuestionStart(Date.now());
    }, 1200);
  }, [answered, done, questions, questionIndex, score, answers, total, questionStart, finishSession]);

  if (done) {
    return (
      <ResultScreen
        score={finalScore}
        total={total}
        onRetry={() => router.push("/daily")}
      />
    );
  }

  const current = questions[questionIndex];

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6 bg-yellow-50">
      <AnswerFeedback result={feedback} />

      {/* Header */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <button onClick={() => router.push("/")} className="text-2xl">←</button>
        <div className="text-center">
          <div className="text-sm text-gray-500">まいにちチャレンジ</div>
          <div className="text-xs text-gray-400">{questionIndex + 1} / {total}</div>
        </div>
        <div className="text-yellow-600 font-bold">⭐ {score}</div>
      </div>

      {/* Timer */}
      <div className="w-full max-w-md mb-6">
        <CountdownTimer
          totalSeconds={totalTime}
          remainingSeconds={remainingSeconds}
          onTimeUp={handleTimeUp}
        />
      </div>

      {/* Question */}
      <div className="w-full max-w-md">
        <QuestionRenderer
          item={current}
          onAnswer={handleAnswer}
          disabled={answered}
        />
      </div>
    </div>
  );
}

function QuestionRenderer({
  item,
  onAnswer,
  disabled,
}: {
  item: DailyChallengeQuestion;
  onAnswer: (value: string, correct: boolean) => void;
  disabled: boolean;
}) {
  if (item.source === "number-sense") {
    const q = item.q;
    if (q.type === "count") {
      return (
        <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center gap-6">
          <div className="text-xl font-bold text-gray-700">いくつ ある？</div>
          <ObjectDisplay count={q.count} emoji={q.emoji} />
          <div className="flex gap-4">
            {q.options.map((opt) => (
              <button
                key={opt}
                disabled={disabled}
                onClick={() => onAnswer(String(opt), opt === q.count)}
                className="w-20 h-20 bg-white rounded-2xl text-3xl font-black text-gray-700 shadow-md border-4 border-orange-200 active:scale-95 transition-transform hover:border-orange-400 disabled:opacity-50"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      );
    }
    // compare
    const correctAnswer = q.left.count > q.right.count ? "left" : "right";
    return (
      <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center gap-6">
        <div className="text-xl font-bold text-gray-700">どちらが おおい？</div>
        <div className="flex items-center gap-4">
          <div className="bg-orange-50 rounded-2xl p-3">
            <ObjectDisplay count={q.left.count} emoji={q.left.emoji} />
          </div>
          <span className="text-2xl font-black text-gray-400">VS</span>
          <div className="bg-blue-50 rounded-2xl p-3">
            <ObjectDisplay count={q.right.count} emoji={q.right.emoji} />
          </div>
        </div>
        <div className="flex gap-4">
          <button
            disabled={disabled}
            onClick={() => onAnswer("left", correctAnswer === "left")}
            className="px-6 py-3 bg-red-400 text-white text-xl font-black rounded-2xl shadow-md border-b-4 border-red-500 active:scale-95 transition-transform disabled:opacity-50"
          >
            ← 左
          </button>
          <button
            disabled={disabled}
            onClick={() => onAnswer("right", correctAnswer === "right")}
            className="px-6 py-3 bg-blue-400 text-white text-xl font-black rounded-2xl shadow-md border-b-4 border-blue-500 active:scale-95 transition-transform disabled:opacity-50"
          >
            右 →
          </button>
        </div>
      </div>
    );
  }

  if (item.source === "mental-math") {
    const q = item.q;
    return (
      <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center gap-6">
        <div className="text-5xl font-black text-gray-800">{q.display}</div>
        <NumberPad
          onSubmit={(val) => onAnswer(String(val), val === q.answer)}
          maxDigits={2}
        />
      </div>
    );
  }

  // story-math
  const q = item.q;
  return (
    <StoryCard
      story={q}
      useOptions={Boolean(item.options?.length)}
      options={item.options}
      disabled={disabled}
      onAnswer={(val) => onAnswer(String(val), val === q.answer)}
    />
  );
}
