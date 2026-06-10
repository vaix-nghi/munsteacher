"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  score: number;
  total: number;
  onRetry?: () => void;
};

function calcStars(score: number, total: number): number {
  const ratio = score / total;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.7) return 2;
  if (ratio >= 0.4) return 1;
  return 0;
}

export function ResultScreen({ score, total, onRetry }: Props) {
  const router = useRouter();
  const stars = calcStars(score, total);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (stars >= 3) setShowConfetti(true);
  }, [stars]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-yellow-50 relative overflow-hidden">
      {showConfetti && <Confetti />}

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm flex flex-col items-center gap-6 relative z-10">
        <div className="text-6xl">{stars >= 3 ? "🎉" : stars >= 2 ? "😊" : "💪"}</div>

        <div className="text-center">
          <div className="text-4xl font-black text-gray-800">
            {score} / {total}
          </div>
          <div className="text-sm text-gray-500 mt-1">せいかい</div>
        </div>

        <div className="flex gap-2">
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className={`text-5xl transition-all ${
                n <= stars ? "text-yellow-400 scale-110" : "text-gray-200"
              }`}
            >
              ★
            </span>
          ))}
        </div>

        <div className="text-base font-bold text-gray-600 text-center">
          {stars === 3
            ? "かんぺき！すごい！"
            : stars === 2
            ? "よくできました！"
            : stars === 1
            ? "もうすこし！がんばれ！"
            : "また チャレンジしよう！"}
        </div>

        <div className="flex flex-col gap-3 w-full">
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full py-4 bg-orange-400 text-white text-lg font-black rounded-2xl shadow-md border-b-4 border-orange-500 active:scale-95 transition-transform"
            >
              もう一度
            </button>
          )}
          <button
            onClick={() => router.push("/")}
            className="w-full py-4 bg-gray-100 text-gray-700 text-lg font-black rounded-2xl shadow-md border-b-4 border-gray-200 active:scale-95 transition-transform"
          >
            ホームへ
          </button>
        </div>
      </div>
    </div>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 30 }, (_, i) => i);
  const colors = ["#FF6B8A", "#FFD93D", "#6BCB77", "#4D96FF", "#FF6B6B", "#C77DFF"];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {pieces.map((i) => {
        const color = colors[i % colors.length];
        const left = `${(i * 137.5) % 100}%`;
        const delay = `${(i * 0.1) % 2}s`;
        const size = 8 + (i % 5) * 3;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left,
              top: "-20px",
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius: i % 2 === 0 ? "50%" : "2px",
              animation: `confettiFall 3s linear ${delay} infinite`,
              transform: `rotate(${i * 30}deg)`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
