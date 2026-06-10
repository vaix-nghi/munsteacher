"use client";

import { useEffect, useRef } from "react";

type Props = {
  totalSeconds: number;
  remainingSeconds: number;
  onTimeUp: () => void;
};

export function CountdownTimer({ totalSeconds, remainingSeconds, onTimeUp }: Props) {
  const calledRef = useRef(false);

  useEffect(() => {
    if (remainingSeconds <= 0 && !calledRef.current) {
      calledRef.current = true;
      onTimeUp();
    }
  }, [remainingSeconds, onTimeUp]);

  const pct = Math.max(0, remainingSeconds / totalSeconds);
  const color =
    remainingSeconds <= 30
      ? "bg-red-500"
      : remainingSeconds <= 60
      ? "bg-yellow-400"
      : "bg-green-400";

  const textColor =
    remainingSeconds <= 30
      ? "text-red-600"
      : remainingSeconds <= 60
      ? "text-yellow-600"
      : "text-green-600";

  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const timeDisplay = `${mins}:${String(secs).padStart(2, "0")}`;

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400">のこり時間</span>
        <span className={`text-sm font-black ${textColor}`}>{timeDisplay}</span>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-1000 ${color}`}
          style={{ width: `${pct * 100}%` }}
        />
      </div>
    </div>
  );
}
