"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { api, ApiError } from "@/lib/api";

const MODULES = [
  {
    id: "number-sense",
    icon: "🍎",
    labelJa: "かずのかんかく",
    labelVi: "Cảm nhận số",
    color: "bg-orange-400",
    border: "border-orange-500",
    href: "/lesson/number-sense",
  },
  {
    id: "mental-math",
    icon: "🧮",
    labelJa: "けいさん",
    labelVi: "Toán miệng",
    color: "bg-blue-400",
    border: "border-blue-500",
    href: "/lesson/mental-math",
  },
  {
    id: "story-math",
    icon: "📖",
    labelJa: "もんだい",
    labelVi: "Bài toán có lời",
    color: "bg-purple-400",
    border: "border-purple-500",
    href: "/lesson/story-math",
  },
  {
    id: "daily",
    icon: "🏆",
    labelJa: "まいにちチャレンジ",
    labelVi: "Thử thách hàng ngày",
    color: "bg-yellow-400",
    border: "border-yellow-500",
    href: "/daily",
  },
] as const;

const DEMO_CHILD_ID = 1;

export default function HomePage() {
  const { data: progress } = useQuery({
    queryKey: ["progress", DEMO_CHILD_ID],
    queryFn: () => api.progress.get(DEMO_CHILD_ID),
    retry: false,
  });
  const {
    isError: isBackendError,
    error: backendError,
  } = useQuery({
    queryKey: ["backend-health"],
    queryFn: () => api.health.check(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const getStars = (moduleId: string) =>
    progress?.find((p) => p.module === moduleId)?.stars ?? 0;

  const streak =
    progress?.find((p) => p.module === "daily")?.streak ?? 0;

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <div className="text-6xl mb-2">🐻</div>
        <h1 className="text-3xl font-black text-orange-600">算数コーチ</h1>
        <p className="text-gray-500 text-sm mt-1">さんすう れんしゅう しよう！</p>
        {streak > 0 && (
          <div className={`mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1 ${streak >= 7 ? "bg-gradient-to-r from-yellow-300 to-orange-400" : "bg-orange-100"}`}>
            <span className="text-lg">{streak >= 7 ? "🏆" : "🔥"}</span>
            <span className={`font-bold text-sm ${streak >= 7 ? "text-white" : "text-orange-700"}`}>
              {streak}日 れんぞく！
            </span>
            {streak >= 7 && (
              <span className="text-white font-black text-xs ml-1">スーパー！</span>
            )}
          </div>
        )}
        {isBackendError && (
          <div className="mt-3 rounded-xl bg-red-100 px-3 py-2 text-xs font-bold text-red-700">
            ⚠️ Lỗi kết nối backend:
            {" "}
            {backendError instanceof ApiError
              ? `${backendError.baseUrl}/api${backendError.path}`
              : "không xác định"}
          </div>
        )}
      </motion.div>

      {/* Module cards */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {MODULES.map((mod, i) => (
          <motion.a
            key={mod.id}
            href={mod.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileTap={{ scale: 0.95 }}
            className={`${mod.color} ${mod.border} border-b-4 rounded-3xl p-5 flex flex-col items-center gap-2 shadow-lg cursor-pointer`}
          >
            <span className="text-5xl">{mod.icon}</span>
            <span className="text-white font-black text-base text-center leading-tight">
              {mod.labelJa}
            </span>
            <span className="text-white/80 text-xs text-center">
              {mod.labelVi}
            </span>
            <Stars count={getStars(mod.id)} />
          </motion.a>
        ))}
      </div>
    </div>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3].map((n) => (
        <span key={n} className={n <= count ? "text-yellow-300" : "text-white/30"}>
          ★
        </span>
      ))}
    </div>
  );
}
