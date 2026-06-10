# Sprint 1 — Foundation

**Thời gian:** Tuần 1  
**Mục tiêu:** Môi trường chạy được, frontend và backend kết nối với nhau, layout cơ bản hiển thị trên tablet.

---

## Checklist

### Backend — Laravel 12 + Sail

- [ ] **1. Tạo Laravel 12 project với Sail**
  ```bash
  curl -s "https://laravel.build/backend?with=mysql" | bash
  cd backend
  ./vendor/bin/sail up -d
  ```
  Kiểm tra: `http://localhost` trả về Laravel welcome page

- [ ] **2. Cấu hình `.env`**
  ```
  APP_NAME=MunsTeacher
  DB_CONNECTION=mysql
  DB_HOST=mysql
  DB_PORT=3306
  DB_DATABASE=munsteacher
  DB_USERNAME=sail
  DB_PASSWORD=password
  OPENAI_API_KEY=sk-...
  ```

- [ ] **3. Tạo migration cho bảng `children`**
  ```bash
  ./vendor/bin/sail artisan make:migration create_children_table
  ```
  Cột: `id`, `name` (string), `avatar` (string, nullable), `timestamps`

- [ ] **4. Tạo migration cho bảng `sessions`**
  Cột: `id`, `child_id` (FK), `module` (string), `score` (int), `total` (int), `duration` (int, giây), `timestamps`

- [ ] **5. Tạo migration cho bảng `answers`**
  Cột: `id`, `session_id` (FK), `question_type` (string), `difficulty` (tinyint), `given_answer` (string), `is_correct` (boolean), `time_spent_ms` (int), `timestamps`

- [ ] **6. Tạo migration cho bảng `progress`**
  Cột: `id`, `child_id` (FK), `module` (string), `stars` (tinyint default 0), `streak` (int default 0), `last_played_at` (timestamp nullable)  
  Index unique: `(child_id, module)`

- [ ] **7. Chạy migrations**
  ```bash
  ./vendor/bin/sail artisan migrate
  ```

- [ ] **8. Tạo Models**
  ```bash
  ./vendor/bin/sail artisan make:model Child
  ./vendor/bin/sail artisan make:model Session
  ./vendor/bin/sail artisan make:model Answer
  ./vendor/bin/sail artisan make:model Progress
  ```
  Thêm `$fillable` và relationships (Child hasMany Sessions, Session hasMany Answers)

- [ ] **9. Tạo API Controllers**
  ```bash
  ./vendor/bin/sail artisan make:controller Api/ChildController --api
  ./vendor/bin/sail artisan make:controller Api/SessionController --api
  ./vendor/bin/sail artisan make:controller Api/ProgressController
  ```

- [ ] **10. Đăng ký routes trong `routes/api.php`**
  ```php
  Route::apiResource('children', ChildController::class);
  Route::apiResource('sessions', SessionController::class);
  Route::get('progress/{childId}', [ProgressController::class, 'show']);
  ```

- [ ] **11. Cấu hình CORS**
  Trong `config/cors.php`:
  ```php
  'allowed_origins' => ['http://localhost:3000'],
  'allowed_methods' => ['*'],
  'allowed_headers' => ['*'],
  ```

- [ ] **12. Kiểm tra API**
  ```bash
  curl http://localhost/api/children
  # Kỳ vọng: {"data": []}
  ```

---

### Frontend — Next.js 15

- [ ] **13. Tạo Next.js 15 project**
  ```bash
  npx create-next-app@latest frontend \
    --typescript \
    --tailwind \
    --app \
    --src-dir \
    --import-alias "@/*"
  cd frontend
  ```

- [ ] **14. Cài dependencies**
  ```bash
  npm install framer-motion zustand @tanstack/react-query @tanstack/react-query-devtools
  npm install next-pwa
  npm install @next/font
  ```

- [ ] **15. Cấu hình font tiếng Nhật**
  Trong `src/app/layout.tsx`, thêm Noto Sans JP:
  ```tsx
  import { Noto_Sans_JP } from 'next/font/google'
  const notoSansJP = Noto_Sans_JP({ subsets: ['latin'], weight: ['400', '700'] })
  ```

- [ ] **16. Tạo `src/lib/api.ts`**
  ```ts
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost'
  
  export async function fetchJSON<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}/api${path}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      ...options,
    })
    if (!res.ok) throw new Error(`API error ${res.status}`)
    return res.json()
  }
  ```

- [ ] **17. Tạo `HomeScreen` (`src/app/page.tsx`)**
  - 4 thẻ module dạng grid 2×2
  - Mỗi thẻ: icon lớn, tên module (tiếng Nhật + Việt), số sao đã đạt
  - Kích thước tối thiểu: 160×160px (touch-friendly trên tablet)
  - Màu nền khác nhau cho từng module

- [ ] **18. Tạo `NumberPad` component (`src/components/NumberPad.tsx`)**
  - Grid 3×4: số 1–9, nút xóa, số 0, nút xác nhận ✓
  - Mỗi nút tối thiểu 64×64px
  - Props: `onSubmit(value: number)`, `maxDigits?: number`
  - Hiển thị số đang nhập ở ô preview phía trên

- [ ] **19. Tạo `AnswerFeedback` component (`src/components/AnswerFeedback.tsx`)**
  - Dùng Framer Motion
  - Đúng: overlay xanh lá + ✓ lớn, scale up rồi fade out (0.6s)
  - Sai: overlay đỏ + ✗ lớn, rung nhẹ (shake animation, 0.4s)
  - Props: `result: 'correct' | 'wrong' | null`

- [ ] **20. Setup React Query Provider**
  Tạo `src/app/providers.tsx`, wrap `QueryClientProvider` + `ReactQueryDevtools`

- [ ] **21. Kiểm tra end-to-end**
  - Mở `http://localhost:3000` → thấy HomeScreen 4 module
  - Bấm số trên NumberPad → nhập được số
  - Giả lập đáp án đúng/sai → thấy animation phản hồi

---

## Definition of Done

- [ ] `sail up -d` → Laravel API trả `200` tại `/api/children`
- [ ] `npm run dev` → Next.js chạy tại `localhost:3000`
- [ ] HomeScreen hiển thị 4 thẻ module, đẹp trên viewport 768×1024 (iPad)
- [ ] NumberPad nhập số được, nút đủ lớn để bấm bằng ngón tay
- [ ] AnswerFeedback animation chạy khi trả lời đúng / sai
- [ ] API call từ frontend tới backend không bị CORS error

---

## Tiếp theo

Sau Sprint 1 hoàn thành → [Sprint 2: 4 Core Modules + API](sprint2.md)
