"use client";

import React from "react";

type IllustrationType = 'candy' | 'apple' | 'pencil' | 'ball' | 'car' | 'flower' | 'star' | 'cookie';

function CandySVG() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="12" fill="#FF6B8A" />
      <circle cx="16" cy="16" r="8" fill="#FF9EB5" />
      <circle cx="16" cy="16" r="4" fill="#FFD1DC" />
    </svg>
  );
}

function AppleSVG() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="18" r="12" fill="#E53E3E" />
      <ellipse cx="12" cy="12" rx="4" ry="3" fill="#C53030" />
      <rect x="15" y="5" width="2" height="6" rx="1" fill="#553C1E" />
      <path d="M17 7 C20 4 24 6" stroke="#38A169" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function PencilSVG() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="7" y="4" width="18" height="20" rx="2" fill="#F6E05E" />
      <rect x="7" y="4" width="18" height="4" rx="1" fill="#FC8181" />
      <polygon points="7,24 25,24 16,30" fill="#FBD38D" />
      <polygon points="13,28 16,30 19,28" fill="#1A202C" />
    </svg>
  );
}

function BallSVG() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="13" fill="#EDF2F7" stroke="#CBD5E0" strokeWidth="1" />
      <path d="M3 16 Q10 8 16 16 Q22 24 29 16" stroke="#4A5568" strokeWidth="1.5" fill="none" />
      <path d="M16 3 Q8 10 16 16 Q24 22 16 29" stroke="#4A5568" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function CarSVG() {
  return (
    <svg width="36" height="28" viewBox="0 0 36 28" fill="none">
      <rect x="2" y="12" width="32" height="10" rx="3" fill="#4299E1" />
      <path d="M8 12 L12 4 L24 4 L28 12" fill="#63B3ED" />
      <circle cx="9" cy="24" r="4" fill="#2D3748" />
      <circle cx="9" cy="24" r="2" fill="#718096" />
      <circle cx="27" cy="24" r="4" fill="#2D3748" />
      <circle cx="27" cy="24" r="2" fill="#718096" />
      <rect x="13" y="5" width="10" height="6" rx="1" fill="#BEE3F8" />
    </svg>
  );
}

function FlowerSVG() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <ellipse cx="16" cy="8" rx="4" ry="6" fill="#FC8181" />
      <ellipse cx="16" cy="24" rx="4" ry="6" fill="#FC8181" />
      <ellipse cx="8" cy="16" rx="6" ry="4" fill="#F6AD55" />
      <ellipse cx="24" cy="16" rx="6" ry="4" fill="#F6AD55" />
      <ellipse cx="10" cy="10" rx="4" ry="6" transform="rotate(-45 10 10)" fill="#FC8181" />
      <ellipse cx="22" cy="22" rx="4" ry="6" transform="rotate(-45 22 22)" fill="#FC8181" />
      <ellipse cx="22" cy="10" rx="4" ry="6" transform="rotate(45 22 10)" fill="#F6AD55" />
      <ellipse cx="10" cy="22" rx="4" ry="6" transform="rotate(45 10 22)" fill="#F6AD55" />
      <circle cx="16" cy="16" r="5" fill="#F6E05E" />
    </svg>
  );
}

function StarSVG() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <polygon
        points="16,2 20,12 30,12 22,18 25,29 16,22 7,29 10,18 2,12 12,12"
        fill="#F6E05E"
        stroke="#D69E2E"
        strokeWidth="1"
      />
    </svg>
  );
}

function CookieSVG() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="13" fill="#C6842A" />
      <circle cx="10" cy="12" r="2" fill="#7B4F1A" />
      <circle cx="20" cy="10" r="2" fill="#7B4F1A" />
      <circle cx="22" cy="20" r="2" fill="#7B4F1A" />
      <circle cx="12" cy="21" r="2" fill="#7B4F1A" />
      <circle cx="17" cy="17" r="1.5" fill="#7B4F1A" />
    </svg>
  );
}

const SVG_MAP: Record<IllustrationType, () => React.ReactElement> = {
  candy: CandySVG,
  apple: AppleSVG,
  pencil: PencilSVG,
  ball: BallSVG,
  car: CarSVG,
  flower: FlowerSVG,
  star: StarSVG,
  cookie: CookieSVG,
};

type Props = {
  type: IllustrationType | string;
  count: number;
};

export function StoryIllustration({ type, count }: Props) {
  const SvgComp = SVG_MAP[type as IllustrationType] ?? CandySVG;
  const items = Array.from({ length: Math.min(count, 20) }, (_, i) => i);
  const columns = Math.min(5, count);

  return (
    <div
      className="flex flex-wrap gap-2 justify-center"
      style={{ maxWidth: `${columns * 44}px` }}
    >
      {items.map((i) => (
        <span key={i}>
          <SvgComp />
        </span>
      ))}
    </div>
  );
}
