"use client";

import { AnimatePresence, motion } from "framer-motion";

type Props = {
  result: "correct" | "wrong" | null;
};

export function AnswerFeedback({ result }: Props) {
  return (
    <AnimatePresence>
      {result && (
        <motion.div
          key={result}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.3 }}
          className={`fixed inset-0 flex items-center justify-center z-50 pointer-events-none ${
            result === "correct" ? "bg-green-400/30" : "bg-red-400/30"
          }`}
        >
          <motion.div
            animate={
              result === "wrong"
                ? { x: [-8, 8, -8, 8, 0] }
                : { scale: [1, 1.2, 1] }
            }
            transition={{ duration: 0.4 }}
            className={`text-9xl ${
              result === "correct" ? "text-green-500" : "text-red-500"
            }`}
          >
            {result === "correct" ? "⭕" : "❌"}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
