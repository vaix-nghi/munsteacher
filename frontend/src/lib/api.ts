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
    create: (name: string, avatar?: string) =>
      fetchJSON<Child>("/children", {
        method: "POST",
        body: JSON.stringify({ name, avatar }),
      }),
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
