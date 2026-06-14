const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function fetchJSON<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...options,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json();
}

export type Child = { id: number; name: string; avatar: string | null };

export type ExerciseTypeSlug =
  | "number-sense"
  | "mental-math"
  | "story-math"
  | "daily";

export type QuestionTemplate = {
  id: number;
  exercise_type_id: number;
  grade: number;
  difficulty: number;
  question_kind: string;
  generation_strategy: "rule_based" | "static";
  rules: Record<string, unknown>;
  possible_answers: Record<string, unknown>;
  is_active: boolean;
  sort_order: number;
};

export type DailyChallengeConfig = {
  child_id: number | null;
  number_sense_count: number;
  mental_math_count: number;
  story_math_count: number;
  total_time_seconds: number;
  is_active: boolean;
};

export type DailySetupResponse = {
  config: DailyChallengeConfig;
  templates: {
    number_sense: QuestionTemplate[];
    mental_math: QuestionTemplate[];
    story_math: QuestionTemplate[];
  };
};

export type ProgressEntry = {
  module: string;
  stars: number;
  streak: number;
  last_played_at: string | null;
  total_count: number;
  correct_count: number;
  accuracy: number;
  weak: boolean;
};

export const api = {
  children: {
    list: () => fetchJSON<Child[]>("/children"),
    get: (childId: number) => fetchJSON<Child>(`/children/${childId}`),
    create: (name: string, avatar?: string) =>
      fetchJSON<Child>("/children", {
        method: "POST",
        body: JSON.stringify({ name, avatar }),
      }),
    getTemplates: (
      childId: number,
      exerciseType: ExerciseTypeSlug,
      difficulty?: number
    ) =>
      fetchJSON<QuestionTemplate[]>(
        `/children/${childId}/templates?exercise_type=${encodeURIComponent(exerciseType)}${
          difficulty ? `&difficulty=${difficulty}` : ""
        }`
      ),
    getDailySetup: (childId: number) =>
      fetchJSON<DailySetupResponse>(`/children/${childId}/daily-setup`),
  },
  progress: {
    get: (childId: number) =>
      fetchJSON<ProgressEntry[]>(`/progress/${childId}`),
  },
  sessions: {
    save: (payload: SessionPayload) =>
      fetchJSON("/sessions", { method: "POST", body: JSON.stringify(payload) }),
  },
};

export async function saveSession(data: SessionPayload): Promise<void> {
  await api.sessions.save(data);
}

export type AnswerPayload = {
  template_id?: number;
  question_type: string;
  difficulty: number;
  given_answer: string;
  is_correct: boolean;
  time_spent_ms: number;
};

export type SessionPayload = {
  child_id: number;
  module: string;
  score: number;
  total: number;
  duration: number;
  answers: AnswerPayload[];
};
