# Sprint 2 — 4 Core Modules + API

**Thời gian:** Tuần 2  
**Mục tiêu:** Cả 4 module chạy được end-to-end, kết quả lưu vào DB, hệ thống sao và streak hoạt động.

---

## Checklist

### Module 1: Number Sense (Cảm nhận số)

- [ ] **1. Tạo `ObjectDisplay` component (`src/components/ObjectDisplay.tsx`)**
  - Props: `count: number`, `emoji: string`
  - Render emoji dàn ra dạng grid (tối đa 5 cột)
  - Animation: các emoji xuất hiện lần lượt (stagger 80ms) bằng Framer Motion
  - Kích thước emoji: 2.5rem trên tablet

- [ ] **2. Tạo engine sinh câu hỏi Number Sense (`src/lib/questions/numberSense.ts`)**
  ```ts
  const EMOJIS = ['🍎', '🚗', '⭐', '🐶', '🍭', '✏️', '🎈', '🌸']
  
  type NumberSenseQuestion =
    | { type: 'count'; count: number; emoji: string; options: number[] }
    | { type: 'compare'; left: { count: number; emoji: string }; right: { count: number; emoji: string } }
  
  export function generateNumberSense(difficulty: 1 | 2): NumberSenseQuestion
  ```
  - Difficulty 1: đếm 1–5
  - Difficulty 2: đếm 1–10, thêm dạng so sánh

- [ ] **3. Tạo page Module Number Sense (`src/app/lesson/number-sense/page.tsx`)**
  - Hiển thị câu hỏi dạng "đếm": ObjectDisplay + 3 ô chọn đáp án lớn
  - Hiển thị câu hỏi dạng "so sánh": 2 ObjectDisplay + 2 nút "左 / 右"
  - Sau khi chọn: AnswerFeedback → tự động sang câu tiếp sau 1.2s

---

### Module 2: Mental Math

- [ ] **4. Tạo engine sinh phép tính (`src/lib/questions/mentalMath.ts`)**
  ```ts
  type MathQuestion = {
    display: string  // e.g. "5 + ? = 8"
    answer: number
    type: 'add' | 'sub' | 'add_missing' | 'sub_missing'
    difficulty: 1 | 2 | 3
  }
  
  export function generateArithmetic(difficulty: 1 | 2 | 3): MathQuestion
  ```
  - Level 1: `a + b` và `a - b` với `a + b ≤ 10`
  - Level 2: `a + b ≤ 20`, có cộng qua 10 (繰り上がり)
  - Level 3: `? + b = c`, `a - ? = c`

- [ ] **5. Tạo `DifficultyAdapter` hook (`src/hooks/useDifficultyAdapter.ts`)**
  - Tăng level sau 3 đúng liên tiếp
  - Giảm level sau 2 sai liên tiếp
  - Lưu state: `currentLevel`, `correctStreak`, `wrongStreak`

- [ ] **6. Tạo page Module Mental Math (`src/app/lesson/mental-math/page.tsx`)**
  - Hiển thị phép tính lớn ở giữa màn hình (font size 3rem+)
  - Nhập đáp án qua NumberPad
  - Hiển thị hint nhỏ sau 10 giây không trả lời (tùy chọn)

---

### Module 3: Story Math (文章問題)

- [ ] **7. Tạo bộ câu chuyện mẫu (`src/data/stories.ts`)**
  Tối thiểu 20 câu, format:
  ```ts
  type Story = {
    id: string
    text_ja: string   // "たろうくんは キャンディを 3つ もっています。おかあさんに 2つ もらいました。ぜんぶで なんこ？"
    text_vi: string   // "Taro có 3 cái kẹo. Mẹ cho thêm 2 cái. Taro có tất cả bao nhiêu cái?"
    answer: number
    operation: 'add' | 'sub'
    image: 'candy' | 'apple' | 'pencil' | 'ball' | 'car' | 'flower' | 'star' | 'cookie'
    difficulty: 1 | 2
  }
  ```
  Bao gồm cả câu cộng và trừ, độ khó 1 (≤10) và 2 (≤20)

- [ ] **8. Tạo SVG minh họa (`src/components/StoryIllustration.tsx`)**
  Vẽ inline SVG đơn giản cho 8 loại đồ vật:
  - 🍬 candy: hình tròn nhiều màu
  - 🍎 apple: hình tròn đỏ + cuống
  - ✏️ pencil: hình chữ nhật vàng + đầu nhọn
  - ⚽ ball: hình tròn + đường chỉ
  - 🚗 car: thân xe đơn giản
  - 🌸 flower: cánh hoa đơn giản
  - ⭐ star: ngôi sao 5 cánh
  - 🍪 cookie: hình tròn nâu
  
  Props: `type: string`, `count: number` → render N hình SVG

- [ ] **9. Tạo `StoryCard` component (`src/components/StoryCard.tsx`)**
  - Phần trên: text câu chuyện (font lớn, có furigana đơn giản nếu cần)
  - Phần giữa: StoryIllustration hiển thị số lượng từ đề bài
  - Phần dưới: NumberPad hoặc 4 ô chọn đáp án

- [ ] **10. Tạo page Module Story Math (`src/app/lesson/story-math/page.tsx`)**

---

### Module 4: Daily Challenge

- [ ] **11. Tạo `QuestionMixer` (`src/lib/questions/dailyChallenge.ts`)**
  - Chọn ngẫu nhiên: 3 câu Number Sense + 4 câu Mental Math + 3 câu Story Math
  - Trộn thứ tự ngẫu nhiên
  - Seed bằng ngày hiện tại để mỗi ngày có bộ câu cố định

- [ ] **12. Tạo `CountdownTimer` component (`src/components/CountdownTimer.tsx`)**
  - Props: `totalSeconds: number`, `onTimeUp: () => void`
  - Thanh progress giảm dần
  - Màu: xanh → vàng (dưới 60s) → đỏ (dưới 30s)
  - Hiển thị số giây còn lại

- [ ] **13. Tạo page Daily Challenge (`src/app/daily/page.tsx`)**
  - 10 câu + timer 5 phút
  - Không cho sửa câu đã trả lời
  - Khi hết giờ hoặc làm xong: chuyển sang màn hình kết quả

- [ ] **14. Tạo `ResultScreen` component (`src/components/ResultScreen.tsx`)**
  - Hiển thị điểm: X / 10
  - Sao: 0 sao (0–3), 1 sao (4–6), 2 sao (7–8), 3 sao (9–10)
  - Confetti animation (CSS animation thuần) khi đạt ≥ 3 sao
  - Nút "もう一度" và "ホームへ"

---

### API — Lưu kết quả

- [ ] **15. Implement `POST /api/sessions` (Laravel)**
  ```php
  // Request: { child_id, module, score, total, duration, answers[] }
  // answers[]: { question_type, difficulty, given_answer, is_correct, time_spent_ms }
  // Transaction: tạo session + tạo tất cả answers
  ```

- [ ] **16. Implement `GET /api/progress/{childId}` (Laravel)**
  ```php
  // Response: [{ module, correct_count, total_count, accuracy, stars, streak }]
  // accuracy = correct_count / total_count * 100
  ```

- [ ] **17. Logic cập nhật streak (Laravel)**
  - Khi lưu session Daily Challenge:
    - Nếu `last_played_at` là ngày hôm qua → `streak++`
    - Nếu `last_played_at` là ngày hôm nay → giữ nguyên
    - Ngày khác → `streak = 1`
  - Cập nhật `progress.last_played_at = now()`

- [ ] **18. Gọi API từ Frontend sau mỗi phiên học**
  Trong `src/lib/api.ts`:
  ```ts
  export async function saveSession(data: SessionPayload): Promise<void>
  ```
  Gọi sau khi `ResultScreen` hiển thị

---

### Hệ thống sao

- [ ] **19. Cập nhật sao trên HomeScreen**
  - Fetch `GET /api/progress/{childId}` khi vào HomeScreen
  - Hiển thị số sao (0–3) trên mỗi thẻ module
  - Dùng React Query cache (staleTime: 1 phút)

- [ ] **20. Hiển thị streak trên HomeScreen**
  - 🔥 Streak: N ngày
  - Nếu streak ≥ 7: thêm badge đặc biệt

---

## Definition of Done

- [ ] Cả 4 module chạy được từ đầu đến cuối không lỗi
- [ ] Làm Daily Challenge xong → DB có bản ghi trong `sessions` và `answers`
- [ ] Streak tăng đúng khi làm Daily Challenge ngày liên tiếp
- [ ] Sao hiển thị đúng trên HomeScreen sau khi làm bài
- [ ] Layout đẹp trên iPad (768×1024) và Android tablet (800×1280)

---

## Tiếp theo

Sau Sprint 2 hoàn thành → [Sprint 3: AI Coach + Polish + PWA](sprint3.md)
