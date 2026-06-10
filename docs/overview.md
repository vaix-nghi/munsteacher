# AI Math Coach for Kids — Tổng quan dự án

## Mục tiêu

Xây dựng web app chạy trên tablet (iPad / Android) để dạy toán cho trẻ lớp 1 Nhật Bản (小学1年生) theo hướng game hóa học tập.

**Triết lý:** Chơi game → Giải quyết vấn đề → Khen thưởng  
(thay vì làm bài tập → chấm điểm)

**Vấn đề cốt lõi lớp 1 không phải tính toán**, mà là:
- Hiểu khái niệm số lượng
- Đọc hiểu đề bài (文章問題)
- Tư duy logic cơ bản
- Duy trì hứng thú học

---

## Tech Stack

| Layer | Công nghệ | Lý do |
|-------|-----------|-------|
| Frontend | Next.js 15 + TypeScript | SSR, PWA, chạy như app trên tablet |
| PWA | next-pwa | Cài từ browser, không cần App Store |
| Styling | Tailwind CSS + Framer Motion | Responsive + animation vui nhộn |
| Backend | Laravel 12 | Quen thuộc, ecosystem tốt |
| Dev Environment | Laravel Sail (Docker) | Chuẩn hóa môi trường |
| Database | MySQL 8 | Lưu progress, sessions, analytics |
| AI | OpenAI API (GPT-4o + Whisper + TTS) | Sinh bài, giải thích, giọng nói |
| State | Zustand + React Query | Client state + server cache |

---

## Kiến trúc hệ thống

```
Tablet (PWA)
    │
    ├── Next.js Frontend (:3000)
    │       ├── /                  ← Home / chọn module
    │       ├── /lesson/[module]   ← Bài học + luyện tập
    │       ├── /daily             ← Daily Challenge
    │       ├── /progress          ← Biểu đồ điểm yếu
    │       └── /parent            ← Dashboard phụ huynh
    │
    └── Laravel API (:8000)
            ├── /api/sessions      ← Lưu kết quả phiên học
            ├── /api/progress      ← Phân tích điểm yếu
            ├── /api/ai/explain    ← GPT-4o giải thích đáp án
            ├── /api/ai/generate   ← Sinh bài cá nhân hóa
            └── /api/ai/transcribe ← Whisper nhận giọng nói
```

### Cấu trúc thư mục project

```
munsteacher/
├── frontend/          ← Next.js 15 + TypeScript
│   ├── src/
│   │   ├── app/           ← App Router pages
│   │   ├── components/    ← NumberPad, StoryCard, ObjectDisplay...
│   │   ├── lib/           ← api.ts, i18n.ts
│   │   └── store/         ← Zustand stores
│   └── package.json
├── backend/           ← Laravel 12 + Sail
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   └── Models/
│   ├── database/migrations/
│   ├── routes/api.php
│   └── docker-compose.yml  ← Sail
└── docs/              ← Tài liệu này
```

---

## Chương trình học (小学1年生算数)

Bám theo sách giáo khoa lớp 1 Nhật — dùng được mỗi ngày sau giờ học:

| # | Chương | Nội dung |
|---|--------|----------|
| 1 | 10までの数 | Đếm và nhận diện 1–10 |
| 2 | 20までの数 | Mở rộng lên 11–20 |
| 3 | 足し算（１桁） | Cộng trong phạm vi 10 |
| 4 | 引き算（１桁） | Trừ trong phạm vi 10 |
| 5 | 足し算（繰り上がり） | Cộng qua 10 |
| 6 | 引き算（繰り下がり） | Trừ có mượn |
| 7 | なんじ・なんじはん | Đọc đồng hồ |
| 8 | 長さ・かさ | So sánh độ dài, thể tích |
| 9 | 文章問題 | Bài toán có lời văn |

---

## 4 Module chính (MVP)

### Module 1: Number Sense (Cảm nhận số)
- Hiển thị vật thể đếm được (🍎🍎🍎) — **không hiện số ngay**
- So sánh 2 nhóm đồ vật: "どちらが おおい?"
- Mục tiêu: hiểu số lượng trước khi hiểu ký hiệu

### Module 2: Mental Math
- Phép tính cơ bản → tăng dần: `5+2=?` → `8+?=12` → `12-?=5`
- Tự động điều chỉnh độ khó theo kết quả gần nhất

### Module 3: Story Math (文章問題)
- Câu chuyện ngắn + hình minh họa SVG
- Trẻ tương tác với hình rồi chọn đáp án
- Quan trọng nhất — phát triển khả năng đọc hiểu

### Module 4: Daily Challenge
- 10 câu / 5 phút mỗi ngày
- Streak 🔥, điểm ⭐, level 🏆

---

## Lộ trình phát triển (4 Level)

| Level | Tính năng | Thời gian |
|-------|-----------|-----------|
| 1 — MVP | 4 module cơ bản, lưu DB | Tuần 1–2 |
| 2 — AI Coach | Micro → Whisper → GPT-4o → TTS | Tuần 3 |
| 3 — Analytics | Biểu đồ điểm yếu, parent dashboard | Tuần 3–4 |
| 4 — Personalization | AI tự sinh bài sau 500 câu | Sau tuần 4 |

---

## Database Schema

```sql
children:  id, name, avatar, created_at
sessions:  id, child_id, module, score, total, duration, created_at
answers:   id, session_id, question_type, difficulty, given_answer, is_correct, time_spent_ms
progress:  id, child_id, module, stars, streak, last_played_at
```

---

## API Endpoints

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/api/children` | Danh sách hồ sơ |
| POST | `/api/children` | Tạo hồ sơ |
| GET | `/api/progress/{childId}` | Tiến trình theo module |
| POST | `/api/sessions` | Lưu kết quả phiên |
| POST | `/api/answers` | Lưu từng câu trả lời |
| POST | `/api/ai/transcribe` | Audio → text (Whisper) |
| POST | `/api/ai/explain` | Giải thích đáp án (GPT-4o) |
| POST | `/api/ai/tts` | Text → giọng nói (TTS) |

---

## Môi trường phát triển (Laravel Sail)

```bash
# Khởi động
cd backend && ./vendor/bin/sail up -d

# Migrations
./vendor/bin/sail artisan migrate

# Alias tiện dụng
alias sail='./vendor/bin/sail'
```

`.env` cần thiết:
```
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=munsteacher
DB_USERNAME=sail
DB_PASSWORD=password
OPENAI_API_KEY=sk-...
```

---

## Sprints

- [Sprint 1](sprint1.md) — Foundation: Next.js + Laravel Sail + DB
- [Sprint 2](sprint2.md) — 4 Core Modules + API
- [Sprint 3](sprint3.md) — AI Coach + Polish + PWA
