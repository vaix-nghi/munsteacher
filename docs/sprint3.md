# Sprint 3 — AI Coach + Polish + PWA

**Thời gian:** Tuần 3–4  
**Mục tiêu:** AI Coach hoạt động bằng giọng nói, phụ huynh xem được báo cáo điểm yếu, cài được như app trên tablet.

---

## Checklist

### Level 2: AI Coach (Giải thích bằng giọng nói)

- [ ] **1. Tạo `MicButton` component (`src/components/MicButton.tsx`)**
  - Nút tròn lớn (80×80px) hình micro 🎤
  - Khi bấm: ghi âm qua `MediaRecorder` API
  - Animation pulse khi đang ghi âm
  - Khi thả: gửi audio blob tới API

- [ ] **2. Implement `POST /api/ai/transcribe` (Laravel)**
  ```php
  // Nhận: multipart audio file
  // Gửi tới OpenAI Whisper: model=whisper-1, language=ja
  // Trả về: { text: "わからない" }
  ```

- [ ] **3. Implement `POST /api/ai/explain` (Laravel)**
  ```php
  // Nhận: { question_text, correct_answer, child_answer, module }
  // Prompt GPT-4o:
  //   "You are a kind teacher for a Japanese 1st grader (小学1年生).
  //    The student was asked: {question_text}
  //    The correct answer is: {correct_answer}
  //    Explain why in simple Japanese using only hiragana and basic kanji.
  //    Use 1-2 short sentences. Be encouraging."
  // Trả về: { explanation: "3このりんごに 2こふえると 5こになります。" }
  ```

- [ ] **4. Implement `POST /api/ai/tts` (Laravel)**
  ```php
  // Nhận: { text: string }
  // Gọi OpenAI TTS: model=tts-1, voice=nova, input=text
  // Trả về: audio/mpeg stream hoặc base64
  ```

- [ ] **5. Tạo `useAICoach` hook (`src/hooks/useAICoach.ts`)**
  ```ts
  // Trạng thái: idle | recording | transcribing | explaining | speaking | error
  // Hàm: startRecording(), stopRecording()
  // Tự động chain: record → transcribe → explain → tts → play audio
  ```

- [ ] **6. Tích hợp MicButton vào màn hình câu hỏi**
  - Hiện khi trả lời sai hoặc hết giờ 1 câu
  - Sau khi AI đọc xong, tự động tiếp tục
  - Hiển thị text giải thích nhỏ bên dưới (accessibility)

---

### Level 3: Phân tích điểm yếu

- [ ] **7. Cài `recharts`**
  ```bash
  npm install recharts
  ```

- [ ] **8. Implement `GET /api/progress/{childId}` chi tiết hơn (Laravel)**
  Thêm filter:
  ```php
  // Query param: ?period=week|month|all
  // Trả về: [{ module, accuracy, total_answered, weak: accuracy < 70 }]
  ```

- [ ] **9. Tạo `ProgressChart` component (`src/components/ProgressChart.tsx`)**
  - Bar chart ngang: mỗi thanh là 1 module
  - Màu: xanh (≥70%), cam (50–69%), đỏ (<50%)
  - Hover: tooltip hiển thị số câu đúng/tổng
  - Dùng Recharts `BarChart` responsive

- [ ] **10. Tạo page Progress (`src/app/progress/page.tsx`)**
  - Header: tên trẻ + avatar
  - Bộ lọc: Tuần này / Tháng này / Tất cả
  - ProgressChart
  - Danh sách module yếu (accuracy < 70%):
    ```
    ⚠️ 文章問題: 50% — もっと れんしゅう しよう！
    ⚠️ 時計: 30% — いっしょに がんばろう！
    ```
  - Nút "このモジュールを練習する" → chuyển thẳng vào module đó

---

### Parent Dashboard

- [ ] **11. Tạo `GET /api/parent/{childId}/summary` (Laravel)**
  ```php
  // Trả về:
  // {
  //   streak: 7,
  //   total_sessions: 23,
  //   total_answers: 230,
  //   weakest_module: "文章問題",
  //   daily_counts: [{ date, count }]  // 30 ngày gần nhất
  // }
  ```

- [ ] **12. Tạo page Parent Dashboard (`src/app/parent/page.tsx`)**
  - Line chart: số câu làm theo ngày (30 ngày)
  - Streak hiện tại + badge nếu ≥ 7 ngày
  - Module yếu nhất (top 2)
  - Bảng 5 phiên học gần nhất: ngày, module, điểm, thời gian
  - Không cần auth cho MVP (chỉ dùng link ẩn `/parent`)

---

### i18n Song ngữ Nhật + Việt

- [ ] **13. Tạo `src/lib/i18n.ts`**
  ```ts
  export type Lang = 'ja' | 'vi'
  
  export const strings = {
    ja: {
      home_title: 'まなぼう！',
      module_number_sense: 'かずのかんかく',
      module_mental_math: 'けいさん',
      module_story_math: 'もんだい',
      module_daily: 'まいにちチャレンジ',
      correct: 'せいかい！',
      wrong: 'もう一度！',
      // ...
    },
    vi: {
      home_title: 'Học thôi!',
      module_number_sense: 'Cảm nhận số',
      module_mental_math: 'Toán miệng',
      module_story_math: 'Bài toán có lời',
      module_daily: 'Thử thách hàng ngày',
      correct: 'Đúng rồi!',
      wrong: 'Thử lại!',
      // ...
    },
  } as const
  ```

- [ ] **14. Tạo `useLang` hook và `LangToggle` component**
  - Lưu lựa chọn vào `localStorage`
  - Default: `ja`
  - Toggle button nhỏ ở góc phải header: 🇯🇵 / 🇻🇳

---

### PWA

- [ ] **15. Cấu hình `next-pwa` trong `next.config.ts`**
  ```ts
  import withPWA from 'next-pwa'
  
  const nextConfig = withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  })({
    // ... next config
  })
  ```

- [ ] **16. Tạo `public/manifest.json`**
  ```json
  {
    "name": "MunsTeacher — 算数コーチ",
    "short_name": "算数",
    "description": "AI Math Coach for Kids",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#FFF9F0",
    "theme_color": "#FF6B35",
    "orientation": "portrait",
    "icons": [
      { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
      { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
    ]
  }
  ```

- [ ] **17. Tạo icon app**
  - Thiết kế đơn giản: nền cam, chữ 算 màu trắng
  - Kích thước: 192×192 và 512×512 PNG
  - Lưu vào `public/icons/`

- [ ] **18. Service Worker cache**
  - Cache shell (HTML/CSS/JS)
  - Cache tĩnh: `src/data/stories.ts` compile thành JSON tĩnh
  - Offline fallback: Daily Challenge vẫn chạy được khi mất mạng (không cần AI)

- [ ] **19. Test PWA trên thiết bị thật**
  - Chrome Android: Menu → "Add to Home screen"
  - Safari iOS: Share → "Add to Home Screen"
  - Kiểm tra: icon xuất hiện, mở fullscreen, không có browser bar

---

### Level 4: AI Cá nhân hóa (nếu còn thời gian)

- [ ] **20. Tạo migration `generated_questions`**
  Cột: `id`, `child_id`, `module`, `question_json` (text), `used` (boolean), `created_at`

- [ ] **21. Tạo Laravel Job `GeneratePersonalizedQuestions`**
  ```php
  // Trigger: sau khi child có ≥ 500 answers
  // Logic:
  //   1. Lấy 20 answers sai gần nhất của child
  //   2. Group theo question_type + difficulty
  //   3. Tìm pattern yếu nhất
  //   4. Gọi GPT-4o:
  //      "Generate 5 math questions for a Japanese 1st grader
  //       similar to these weak areas: {weak_patterns}
  //       Format: JSON array of {text_ja, text_vi, answer, type}"
  //   5. Lưu vào generated_questions
  ```

- [ ] **22. Tích hợp câu hỏi cá nhân hóa vào Daily Challenge**
  - Nếu `generated_questions` có bản ghi chưa dùng → ưu tiên 2–3 câu trong 10 câu daily
  - Đánh dấu `used = true` sau khi làm

---

## Definition of Done

- [ ] Bấm micro nói 「わからない」→ AI giải thích bằng tiếng Nhật, tự động đọc to
- [ ] Trang `/progress` hiển thị đúng tỉ lệ % theo module, highlight module yếu
- [ ] Toggle ngôn ngữ Nhật/Việt hoạt động, lưu giữa các lần mở app
- [ ] PWA: Add to Home Screen thành công trên Chrome Android hoặc Safari iOS
- [ ] App chạy offline (Daily Challenge không cần mạng)
- [ ] Parent Dashboard hiển thị đúng streak và lịch sử 30 ngày

---

## Sau Sprint 3

Ứng dụng đã hoàn chỉnh cho daily use. Các bước nâng cấp tiếp theo có thể là:
- Thêm chương trình học kỳ 2 (なんじ・なんじはん, 長さ)
- Multi-child profile (nhiều hồ sơ con)
- Gamification sâu hơn (bản đồ màn chơi, nhân vật unlock)
- Sync cloud khi có nhiều thiết bị
