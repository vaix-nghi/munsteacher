"use client";

import { motion } from "framer-motion";

type Props = {
  count: number;
  emoji: string;
};

export function ObjectDisplay({ count, emoji }: Props) {
  const items = Array.from({ length: count }, (_, i) => i);
  const columns = Math.min(5, count);

  return (
    <div
      className="flex flex-wrap gap-1 justify-center"
      style={{ maxWidth: `${columns * 3}rem` }}
    >
      {items.map((i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.08, type: "spring", stiffness: 300 }}
          className="text-[2.5rem] leading-none select-none"
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
}
