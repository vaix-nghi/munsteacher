"use client";

import { StoryIllustration } from "./StoryIllustration";
import { NumberPad } from "./NumberPad";
import type { Story } from "@/data/stories";

type Props = {
  story: Story;
  onAnswer: (value: number) => void;
  useOptions?: boolean;
  options?: number[];
  disabled?: boolean;
};

export function StoryCard({ story, onAnswer, useOptions = false, options, disabled = false }: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
      {/* Story text */}
      <div className="p-6 bg-purple-50">
        <p className="text-lg font-bold text-gray-800 leading-relaxed text-center">
          {story.text_ja}
        </p>
        <p className="text-sm text-gray-500 mt-2 text-center">{story.text_vi}</p>
      </div>

      {/* Illustration */}
      <div className="flex justify-center py-5 bg-white border-y border-purple-100">
        <StoryIllustration type={story.image} count={story.answer} />
      </div>

      {/* Answer input */}
      <div className="p-6 flex flex-col items-center gap-4">
        <div className="text-base font-bold text-purple-700">こたえは？</div>
        {useOptions && options ? (
          <div className="flex gap-4">
            {options.map((opt) => (
              <button
                key={opt}
                disabled={disabled}
                onClick={() => onAnswer(opt)}
                className="w-20 h-20 bg-white rounded-2xl text-3xl font-black text-gray-700 shadow-md border-4 border-purple-200 active:scale-95 transition-transform hover:border-purple-400 disabled:opacity-50"
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <NumberPad onSubmit={onAnswer} maxDigits={2} />
        )}
      </div>
    </div>
  );
}
