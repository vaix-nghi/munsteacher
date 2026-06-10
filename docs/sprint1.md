# Sprint 1 — Foundation

**Thời gian:** Tuần 1  
**Mục tiêu:** Môi trường chạy được, frontend và backend kết nối với nhau, layout cơ bản hiển thị trên tablet.

---

## Checklist

### Backend — Laravel 12 + Sail

- [x] **1. Tạo Laravel 12 project với Sail**
  ```bash
  curl -s "https://laravel.build/backend?with=mysql" | bash
  cd backend
  ./vendor/bin/sail up -d
  ```
  > Thực tế: dùng `composer create-project` + `composer require laravel/sail` + `sail:install --with=mysql`.  
  > Sail chạy port `8000` (port 80 bị chiếm), Vite port `5174`.

- [x] **2. Cấu hình `.env`**
  ```
  APP_NAME=MunsTeacher
  DB_CONNECTION=mysql
  DB_HOST=mysql
  DB_PORT=3306
  DB_DATABASE=munsteacher
  DB_USERNAME=sail
  DB_PASSWORD=password
  OPENAI_API_KEY=sk-...
  APP_PORT=8000
  VITE_PORT=5174
  ```

- [x] **3. Tạo migration cho bảng `children`**
  ```bash
  ./vendor/bin/sail artisan make:migration create_children_table
  ```
  Cột: `id`, `name` (string), `avatar` (string, nullable), `timestamps`

- [x] **4. Tạo migration cho bảng `sessions`**
  > ⚠️ Đổi tên thành `learning_sessions` (tránh conflict với bảng `sessions` mặc định của Laravel).  
  Cột: `id`, `child_id` (FK), `module` (string), `score` (int), `total` (int), `duration` (int, giây), `timestamps`

- [x] **5. Tạo migration cho bảng `answers`**
  Cột: `id`, `session_id` (FK → `learning_sessions`), `question_type` (string), `difficulty` (tinyint), `given_answer` (string), `is_correct` (boolean), `time_spent_ms` (int), `timestamps`

- [x] **6. Tạo migration cho bảng `progress`**
  Cột: `id`, `child_id` (FK), `module` (string), `stars` (tinyint default 0), `streak` (int default 0), `last_played_at` (timestamp nullable)  
  Index unique: `(child_id, module)`

- [x] **7. Chạy migrations**
  ```bash
  ./vendor/bin/sail artisan migrate
  ```

- [x] **8. Tạo Models**
  ```bash
  ./vendor/bin/sail artisan make:model Child
  ./vendor/bin/sail artisan make:model LearningSession   # (đổi từ Session)
  ./vendor/bin/sail artisan make:model Answer
  ./vendor/bin/sail artisan make:model Progress
  ```
  Đã thêm `$fillable`, relationships, và `$table = 'learning_sessions'` cho `LearningSession`.

- [x] **9. Tạo API Controllers**
  ```bash
  ./vendor/bin/sail artisan make:controller Api/ChildController --api
  ./vendor/bin/sail artisan make:controller Api/SessionController
  ./vendor/bin/sail artisan make:controller Api/ProgressController
  ```
  > Thêm: `install:api` để tạo `routes/api.php` (Laravel 12 không có sẵn).

- [x] **10. Đăng ký routes trong `routes/api.php`**
  ```php
  Route::get('children', [ChildController::class, 'index']);
  Route::post('children', [ChildController::class, 'store']);
  Route::get('children/{child}', [ChildController::class, 'show']);
  Route::post('sessions', [SessionController::class, 'store']);
  Route::get('sessions', [SessionController::class, 'index']);
  Route::get('progress/{childId}', [ProgressController::class, 'show']);
  ```

- [x] **11. Cấu hình CORS**
  Trong `config/cors.php` (publish bằng `sail artisan config:publish cors`):
  ```php
  'allowed_origins' => ['http://localhost:3000'],
  'allowed_methods' => ['*'],
  'allowed_headers' => ['*'],
  ```

- [x] **12. Kiểm tra API**
  ```bash
  curl http://localhost:8000/api/children
  # Kết quả: []
  curl -X POST http://localhost:8000/api/children -d '{"name":"テスト"}' ...
  # Kết quả: {"id":1,"name":"テスト",...}
  ```

---

### Frontend — Next.js 15

- [x] **13. Tạo Next.js 15 project**
  ```bash
  npx create-next-app@latest frontend \
    --typescript --tailwind --app --src-dir --import-alias "@/*"
  ```
  > Node.js cần v22+. Dùng `nvm install 22 && nvm use 22` trước khi chạy.

- [x] **14. Cài dependencies**
  ```bash
  npm install framer-motion zustand @tanstack/react-query @tanstack/react-query-devtools next-pwa
  ```

- [x] **15. Cấu hình font tiếng Nhật**
  Trong `src/app/layout.tsx`, dùng Noto Sans JP:
  ```tsx
  import { Noto_Sans_JP } from 'next/font/google'
  const notoSansJP = Noto_Sans_JP({ subsets: ['latin'], weight: ['400', '700', '900'] })
  ```

- [x] **16. Tạo `src/lib/api.ts`**
  Bao gồm `fetchJSON<T>`, types `Child`, `ProgressEntry`, `SessionPayload`, `AnswerPayload`, và object `api` với các method `children`, `progress`, `sessions`.

- [x] **17. Tạo `HomeScreen` (`src/app/page.tsx`)**
  - 4 thẻ module dạng grid 2×2
  - Mỗi thẻ: icon lớn, tên module (tiếng Nhật + Việt), số sao, màu nền riêng
  - Hiển thị streak 🔥 nếu > 0
  - Fetch progress từ API qua React Query

- [x] **18. Tạo `NumberPad` component (`src/components/NumberPad.tsx`)**
  - Grid 3×4: số 1–9, nút xóa ←, số 0, nút xác nhận ✓
  - Mỗi nút 64×64px (w-16 h-16)
  - Props: `onSubmit(value: number)`, `maxDigits?: number`
  - Ô preview hiển thị số đang nhập phía trên

- [x] **19. Tạo `AnswerFeedback` component (`src/components/AnswerFeedback.tsx`)**
  - Framer Motion `AnimatePresence`
  - Đúng: overlay xanh + ⭕ scale animation
  - Sai: overlay đỏ + ❌ shake animation
  - Props: `result: 'correct' | 'wrong' | null`

- [x] **20. Setup React Query Provider**
  `src/app/providers.tsx` — wrap `QueryClientProvider` + `ReactQueryDevtools`, staleTime 60s.

- [x] **21. Kiểm tra end-to-end**
  - `http://localhost:3000` → HomeScreen 4 module hiển thị
  - API `/api/progress/1` → trả JSON đúng cấu trúc
  - Build `npm run build` → pass không lỗi TypeScript

---

## Definition of Done

- [x] `sail up -d` → Laravel API trả `200` tại `/api/children`
- [x] `npm run dev` → Next.js chạy tại `localhost:3000`
- [x] HomeScreen hiển thị 4 thẻ module, đẹp trên viewport 768×1024 (iPad)
- [x] NumberPad nhập số được, nút đủ lớn để bấm bằng ngón tay
- [x] AnswerFeedback animation chạy khi trả lời đúng / sai
- [x] API call từ frontend tới backend không bị CORS error

---

## Ghi chú thực tế

- **`sessions` → `learning_sessions`**: Laravel 12 tự tạo bảng `sessions` cho session management, cần đổi tên bảng của app.
- **Port**: Sail chạy `APP_PORT=8000`, Vite `VITE_PORT=5174` (port mặc định 80/5173 bị chiếm).
- **Node.js**: Next.js yêu cầu v20+, môi trường mặc định có v18 → cài v22 qua nvm.
- **`routes/api.php`**: Không có sẵn trong Laravel 12, cần chạy `php artisan install:api`.

---

## Tiếp theo

Sau Sprint 1 hoàn thành → [Sprint 2: 4 Core Modules + API](sprint2.md)
