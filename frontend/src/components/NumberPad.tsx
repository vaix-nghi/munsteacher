"use client";

import { useState } from "react";

type Props = {
  onSubmit: (value: number) => void;
  maxDigits?: number;
};

export function NumberPad({ onSubmit, maxDigits = 2 }: Props) {
  const [input, setInput] = useState("");

  const press = (digit: string) => {
    if (input.length >= maxDigits) return;
    setInput((prev) => prev + digit);
  };

  const clear = () => setInput((prev) => prev.slice(0, -1));

  const submit = () => {
    if (!input) return;
    onSubmit(parseInt(input, 10));
    setInput("");
  };

  const buttons = [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
  ];

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {/* Display */}
      <div className="w-48 h-16 bg-white rounded-2xl border-4 border-orange-300 flex items-center justify-center text-4xl font-black text-gray-800 tracking-widest shadow-inner">
        {input || <span className="text-gray-300">?</span>}
      </div>

      {/* Number grid */}
      <div className="flex flex-col gap-2">
        {buttons.map((row, ri) => (
          <div key={ri} className="flex gap-2">
            {row.map((d) => (
              <button
                key={d}
                onClick={() => press(d)}
                className="w-16 h-16 bg-white rounded-2xl text-2xl font-bold text-gray-700 shadow-md border-2 border-gray-200 active:scale-95 active:shadow-inner transition-transform"
              >
                {d}
              </button>
            ))}
          </div>
        ))}

        {/* Bottom row: clear / 0 / submit */}
        <div className="flex gap-2">
          <button
            onClick={clear}
            className="w-16 h-16 bg-red-100 rounded-2xl text-2xl font-bold text-red-500 shadow-md border-2 border-red-200 active:scale-95 transition-transform"
          >
            ←
          </button>
          <button
            onClick={() => press("0")}
            className="w-16 h-16 bg-white rounded-2xl text-2xl font-bold text-gray-700 shadow-md border-2 border-gray-200 active:scale-95 transition-transform"
          >
            0
          </button>
          <button
            onClick={submit}
            className="w-16 h-16 bg-green-400 rounded-2xl text-2xl font-bold text-white shadow-md border-2 border-green-500 active:scale-95 transition-transform"
          >
            ✓
          </button>
        </div>
      </div>
    </div>
  );
}
