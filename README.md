# Web Programmer Challenge - PT. JAVIS TEKNOLOGI ALBAROKAH

## Arsitektur Proyek

1.  **Frontend (`web-challenge`):** Dibangun menggunakan Next.js dengan App Router, React, dan TypeScript. Bertanggung jawab untuk antarmuka pengguna (UI), interaksi pengguna, dan komunikasi dengan backend. Menggunakan Shadcn UI untuk komponen UI. Permintaan API ke backend diproksi melalui `/api/*` menggunakan fitur rewrites Next.js.
2.  **Backend (`backend-express`):** Dibangun menggunakan Express.js, TypeScript, dan berjalan di runtime Bun/Node.js. Bertanggung jawab untuk logika bisnis, manajemen data (MySQL dengan TypeORM), autentikasi (JWT), dan menyediakan RESTful API untuk frontend. Menggunakan Redis untuk rate limiting.

## Tech Stack

### Frontend (`web-challenge`)

* **Framework:** Next.js
* **Styling:** Tailwind CSS 4
* **Komponen UI:** Shadcn UI
* **Manajemen State/Routing:** React Hooks, Next.js App Router

### Backend (`backend-express`)

* **Framework:** Express.js
* **Runtime:** Bun / Node.js
* **Bahasa:** TypeScript
* **Database:** MySQL
* **ORM:** TypeORM
* **Autentikasi:** JSON Web Tokens (JWT), bcrypt
* **Caching/Rate Limiting:** Redis
* **Validasi:** Zod
* **Middleware:** CORS, Cookie Parser, Express Rate Limit

## Menjalankan Proyek

### Prasyarat
* Bun/NodeJS
* npm/yarn/pnpm
* Database MySQL
* Server Redis

### Backend (`backend-express`)

1.  **Clone repository**.
2.  **Masuk ke direktori `backend-express`:**
3.  **Salin file `.env.example`** (jika ada) atau buat file `.env` baru dan konfigurasikan variabel lingkungan sesuai kebutuhan (database, redis, JWT secrets, port). Pastikan konfigurasi database dan Redis sesuai dengan setup lokal Anda. Contoh `.env`:
    ```dotenv
    PORT=8000
    NODE_ENV=development

    # Database
    DATABASE_TYPE=mysql
    DATABASE_HOST=localhost
    DATABASE_USERNAME=root
    DATABASE_PASSWORD=root
    DATABASE_PORT=3306
    DATABASE_NAME=web_challenge

    # Redis
    REDIS_URL=redis://127.0.0.1:6379

    # JWT
    JWT_ACCESS_SECRET=your-access-secret
    JWT_REFRESH_SECRET=your-refresh-secret

    # CORS
    CORS_ORIGIN=http://localhost:3000
    ```
4.  **Install dependensi:**
    ```bash
    bun install
    ```
5.  **Jalankan server development:**
    ```bash
    bun run dev
    ```
    Server backend akan berjalan di port yang ditentukan di `.env` (default 8000).

### Frontend (`web-challenge`)

1.  **Clone repository**.
2.  **Masuk ke direktori `web-challenge`:**
3.  **Install dependensi** (pilih salah satu):
    ```bash
    bun install
    ```
4.  **Jalankan server development** (pilih salah satu sesuai package manager yang digunakan):
    ```bash
    bun dev
    ```
    Server frontend akan berjalan secara default di [http://localhost:3000](http://localhost:3000). Pastikan server backend sudah berjalan terlebih dahulu.

## Penjelasan Arsitektur Tambahan

* **Autentikasi:** Frontend mengirimkan kredensial ke endpoint `/api/auth/login` di backend. Backend memvalidasi kredensial, membuat JWT access token (durasi pendek) dan refresh token (durasi panjang), lalu menyimpannya di httpOnly cookies. Middleware di frontend (`src/middleware.ts`) memeriksa keberadaan token untuk melindungi rute `/dashboard`. Middleware di backend (`src/middleware/auth.middleware.ts`) memverifikasi access token pada setiap permintaan ke endpoint yang dilindungi. Jika access token kedaluwarsa, frontend dapat meminta token baru menggunakan refresh token melalui endpoint `/api/auth/refresh`.
* **Struktur Direktori:**
    * **Frontend:** Mengikuti struktur standar Next.js App Router (`src/app/`, `src/components/`, `src/lib/`, dll.). Komponen UI ditempatkan di `src/components/ui/` mengikuti Shadcn UI.
    * **Backend:** Menggunakan struktur berbasis fitur/layer (`src/controllers/`, `src/services/`, `src/entity/`, `src/routes/`, `src/middleware/`, `src/validators/`) untuk memisahkan concerns. `src/data-source.ts` berisi konfigurasi TypeORM. `src/server.ts` adalah entry point aplikasi Express.
* **Styling:** Frontend menggunakan Tailwind CSS dengan konfigurasi dasar yang disediakan oleh `create-next-app` dan Shadcn UI, termasuk variabel CSS untuk theming (dark/light mode).