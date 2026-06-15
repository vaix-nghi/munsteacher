"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ObjectDisplay } from "@/components/ObjectDisplay";
import { AnswerFeedback } from "@/components/AnswerFeedback";
import { api, type AnswerPayload } from "@/lib/api";
import type { NumberSenseQuestion } from "@/lib/questions/numberSense";
import {
  generateNumberSenseQuestion,
  type GeneratedNumberSenseQuestion,
} from "@/lib/questions/templateBased";

const TOTAL = 8;
const DEMO_CHILD_ID = 1;
const DIFFICULTY: 1 | 2 = 1;

export default function NumberSensePage() {
  const router = useRouter();
  const { data: templates, isError } = useQuery({
    queryKey: ["templates", DEMO_CHILD_ID, "number-sense"],
    queryFn: () => api.children.getTemplates(DEMO_CHILD_ID, "number-sense"),
    retry: false,
    refetchOnWindowFocus: false,
  });
  const [currentQuestion, setCurrentQuestion] = useState<GeneratedNumberSenseQuestion | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [answered, setAnswered] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<AnswerPayload[]>([]);
  const [startTime] = useState(Date.now());
  const [questionStart, setQuestionStart] = useState(Date.now());

  const nextQuestion = useCallback(
    () => generateNumberSenseQuestion(templates ?? [], DIFFICULTY),
    [templates]
  );

  useEffect(() => {
    if (templates || isError) {
      setCurrentQuestion(nextQuestion());
      setQuestionStart(Date.now());
    }
  }, [templates, isError, nextQuestion]);

  const handleAnswer = useCallback((isCorrect: boolean, givenAnswer: string) => {
    if (answered || !currentQuestion) return;
    setAnswered(true);
    setFeedback(isCorrect ? "correct" : "wrong");

    const answer: AnswerPayload = {
      template_id: currentQuestion.templateId,
      question_type: currentQuestion.question.type,
      difficulty: currentQuestion.difficulty,
      given_answer: givenAnswer,
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
          module: "number-sense",
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
      setCurrentQuestion(nextQuestion());
      setQuestionStart(Date.now());
    }, 1200);
  }, [answered, currentQuestion, questionIndex, score, answers, startTime, questionStart, router, nextQuestion]);

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50 text-orange-600 font-bold">
        よみこみちゅう...
      </div>
    );
  }

  const question = currentQuestion.question;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-orange-50">
      <AnswerFeedback result={feedback} />

      {/* Header */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <button onClick={() => router.push("/")} className="text-2xl">←</button>
        <div className="text-center">
          <div className="text-sm text-gray-500">かずのかんかく</div>
          <div className="text-xs text-gray-400">{questionIndex + 1} / {TOTAL}</div>
        </div>
        <div className="text-orange-600 font-bold">⭐ {score}</div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md h-2 bg-orange-100 rounded-full mb-8">
        <div
          className="h-2 bg-orange-400 rounded-full transition-all"
          style={{ width: `${((questionIndex) / TOTAL) * 100}%` }}
        />
      </div>

      {question.type === "count" ? (
        <CountQuestion question={question} onAnswer={handleAnswer} />
      ) : (
        <CompareQuestion question={question} onAnswer={handleAnswer} />
      )}
    </div>
  );
}

function CountQuestion({
  question,
  onAnswer,
}: {
  question: Extract<NumberSenseQuestion, { type: "count" }>;
  onAnswer: (correct: boolean, given: string) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-xl font-bold text-gray-700">いくつ ある？</div>
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <ObjectDisplay count={question.count} emoji={question.emoji} />
      </div>
      <div className="flex gap-4">
        {question.options.map((opt) => (
          <button
            key={opt}
            onClick={() => onAnswer(opt === question.count, String(opt))}
            className="w-20 h-20 bg-white rounded-2xl text-3xl font-black text-gray-700 shadow-md border-4 border-orange-200 active:scale-95 transition-transform hover:border-orange-400"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function CompareQuestion({
  question,
  onAnswer,
}: {
  question: Extract<NumberSenseQuestion, { type: "compare" }>;
  onAnswer: (correct: boolean, given: string) => void;
}) {
  const correctAnswer = question.left.count > question.right.count ? "left" : "right";

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-xl font-bold text-gray-700">どちらが おおい？</div>
      <div className="flex items-center gap-6">
        <div className="bg-white rounded-3xl p-4 shadow-lg">
          <ObjectDisplay count={question.left.count} emoji={question.left.emoji} />
        </div>
        <span className="text-3xl font-black text-gray-400">VS</span>
        <div className="bg-white rounded-3xl p-4 shadow-lg">
          <ObjectDisplay count={question.right.count} emoji={question.right.emoji} />
        </div>
      </div>
      <div className="flex gap-6">
        <button
          onClick={() => onAnswer(correctAnswer === "left", "left")}
          className="px-8 py-4 bg-red-400 text-white text-xl font-black rounded-2xl shadow-md border-b-4 border-red-500 active:scale-95 transition-transform"
        >
          ← 左
        </button>
        <button
          onClick={() => onAnswer(correctAnswer === "right", "right")}
          className="px-8 py-4 bg-blue-400 text-white text-xl font-black rounded-2xl shadow-md border-b-4 border-blue-500 active:scale-95 transition-transform"
        >
          右 →
        </button>
      </div>
    </div>
  );
}
