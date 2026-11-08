# App Template — Mind Map

A complete map of the **App Template** project: a plug-and-play Next.js 16 app with
authentication, user profiles, password management, role-based admin dashboard, and
Cloudflare Workers (OpenNext) deployment.

---

## 1. Project Overview

```
App Template
├─ Purpose: Drop-in Next.js starter with auth, users, profile, admin dashboard
├─ Status: Production-ready template (needs DATABASE_URL, JWT_SECRET, RESEND_API_KEY)
├─ License: MIT
└─ Primary branch: main
```

### What it does
- Public landing page with Sign in / Sign up
- Email-based authentication (login, register, logout)
- Email verification + forgot/reset password flows
- User profile & password change (self-service)
- Admin dashboard: list, create, update, delete users (role-based access control)
- System settings registry (app name, support email, session timeout, email verification)
- JWT sessions in httpOnly cookies; bcrypt password hashing
- Deployable to Cloudflare Workers via OpenNext

---

## 2. Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Server Components + API routes) |
| UI | React 19, Tailwind CSS 4, lucide-react |
| Forms | react-hook-form + zod + @hookform/resolvers |
| Database | PostgreSQL (Neon serverless) via `@neondatabase/serverless` |
| Auth | JWT (`jose`), httpOnly cookies, bcryptjs |
| Email | Resend |
| Deployment | OpenNext (`@opennextjs/cloudflare`) + Cloudflare Workers (wrangler) |
| Tooling | ESLint, Vitest, PostCSS |

---

## 3. Folder Structure (actual)

```
app-template/
├─ app/                          # Next.js App Router
│   ├─ layout.js                 # Root layout, metadata, ToasterProvider, VersionBanner
│   ├─ page.js                   # Landing page (public)
│   ├─ error.js                  # Root error boundary (client)
│   ├─ globals.css               # Tailwind imports + theme variables
│   ├─ (app)/                    # Authenticated user routes (redirects admins to /admin)
│   │   ├─ layout.js             # User layout + Sidebar (requires session)
│   │   ├─ page.js               # /app dashboard
│   │   └─ settings/             # /app/settings — profile & password (client)
│   ├─ (auth)/                   # Public auth pages
│   │   ├─ login/                # /login
│   │   ├─ register/             # /register
│   │   ├─ forgot-password/      # /forgot-password
│   │   ├─ reset-password/       # /reset-password?token=xxx
│   │   └─ verify-email/         # /verify-email?token=xxx
│   ├─ admin/                    # Admin-only routes
│   │   ├─ layout.js             # Admin layout + AdminSidebar (requires admin role)
│   │   ├─ page.js               # /admin dashboard
│   │   └─ users/                # /admin/users — user management (client)
│   └─ api/                      # API routes
│       ├─ auth/login            # POST — sign in, sets app_session cookie
│       ├─ auth/register         # POST — sign up + verification email, sets session
│       ├─ auth/logout           # POST — clears session cookie
│       ├─ auth/forgot-password  # POST — issues reset token + email
│       ├─ auth/reset-password   # POST — confirms reset with token
│       ├─ auth/verify-email     # GET  — verifies email with token
│       ├─ me/profile            # PATCH — update current user profile
│       ├─ me/password           # PATCH — change current user password
│       └─ admin/users           # GET/POST/PATCH/DELETE — user management (admin only)
├─ components/
│   ├─ auth/                     # AuthForm, AuthShell, TokenAuthClient, VerifyEmailClient
│   ├─ layout/                   # AdminSidebar, PageHeader, PublicNav, Sidebar
│   └─ ui/                       # Card, Toaster, VersionBanner, utils (cn)
├─ lib/
│   ├─ auth/                     # admin, current-user, password, session
│   ├─ core/                     # app-url, db, email, error-log, request-cache
│   ├─ public/                   # branding (APP_NAME, SUPPORT_EMAIL)
│   └─ settings/                 # registry (setting definitions), service (get/update)
├─ database/
│   ├─ schema.sql                # Users, error_logs, system_settings DDL
│   └─ seed.sql                  # Demo admin + demo user, default settings
├─ docs/
│   └─ APP-Template-MIND-MAP.MD  # this file
├─ package.json, next.config.mjs, wrangler.toml,
│   open-next.config.ts, postcss.config.js, jsconfig.json, .env.example, .gitignore
└─ README.md                     # user-facing quick start
```

> Note: `frontend/`, `backend/`, `scripts/`, `proxy.js` referenced by older docs do **not** exist — all code lives in `app/`, `components/`, and `lib/`.

## 4. Routes & Features

### 4.1 Public pages
| Route | Page | Description |
|-------|------|-------------|
| `GET /` | Landing page | Features, sign in / sign up links |
| `GET /login` | Login page | Email/password sign in |
| `GET /register` | Register page | Sign up (sends verification email) |
| `GET /forgot-password` | Forgot password | Request reset link |
| `GET /reset-password?token=` | Reset password | Set new password from token |
| `GET /verify-email?token=` | Verify email | Verify email from token |

### 4.2 Authenticated user routes (`/app/*`)
| Route | Page | Description |
|-------|------|-------------|
| `GET /app` | Dashboard | User role, status, quick links to settings |
| `GET /app/settings` | Settings | Profile update + password change + sign out |

### 4.3 Admin routes (`/admin/*`, admin role only)
| Route | Page | Description |
|-------|------|-------------|
| `GET /admin` | Admin dashboard | Total users stat + user management link |
| `GET /admin/users` | User management | List/create/edit/delete users |

### 4.4 API routes
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| `POST` | `/api/auth/login` | Public | Sign in; sets `app_session` httpOnly cookie |
| `POST` | `/api/auth/register` | Public | Create account; sends verification email; sets session |
| `POST` | `/api/auth/logout` | Public | Clears session cookie |
| `POST` | `/api/auth/forgot-password` | Public | Issues reset token, emails reset link |
| `POST` | `/api/auth/reset-password` | Public | Resets password with valid token |
| `GET` | `/api/auth/verify-email` | Public | Marks email verified with valid token |
| `PATCH` | `/api/me/profile` | Authenticated | Update full_name + email |
| `PATCH` | `/api/me/password` | Authenticated | Change password (current password required) |
| `GET` | `/api/admin/users` | Admin | List all users |
| `POST` | `/api/admin/users` | Admin | Create user |
| `PATCH` | `/api/admin/users` | Admin | Update user (body includes `userId`) |
| `DELETE` | `/api/admin/users?id=` | Admin | Delete user |


## 5. Core Libraries (`lib/`)

| File | Responsibility |
|------|----------------|
| `lib/auth/session.js` | JWT sign/verify (`jose`), cookie name `app_session`, TTL 30 days, `readSession()` (server), `getSessionFromClient()` (client) |
| `lib/auth/current-user.js` | `getCurrentUserServer()`, `getCurrentUserClient()`, `getCurrentUser()` — loads user row from `users` by session |
| `lib/auth/admin.js` | `isAdmin`, `getAdminUser`, `grantAdmin`, `revokeAdmin`, `listUsers`, `createUser`, `updateUser`, `deleteUser` |
| `lib/auth/password.js` | `hashPassword` / `verifyPassword` (bcryptjs, 10 rounds) |
| `lib/core/db.js` | Singleton Neon SQL client from `DATABASE_URL` |
| `lib/core/app-url.js` | Resolves base URL from request headers or `NEXT_PUBLIC_APP_URL` |
| `lib/core/email.js` | Resend wrapper (`sendEmail`); no-op log when `RESEND_API_KEY` missing |
| `lib/core/error-log.js` | `logError` / `logStatusError` — writes to `error_logs` table |
| `lib/core/request-cache.js` | Per-request in-memory cache (`Map`) |
| `lib/public/branding.js` | `APP_NAME = "App Template"`, `SUPPORT_EMAIL` |
| `lib/settings/registry.js` | Setting definitions (app_name, support_email, session_timeout_days, require_email_verification), coercion/validation |
| `lib/settings/service.js` | `getSystemSettings()`, `getSetting(key)`, `updateSystemSettings()` — backed by `system_settings` table |

## 6. Database Schema (`database/schema.sql`)

PostgreSQL with `pgcrypto` extension:

**`users`**
- `id` UUID PK (gen_random_uuid)
- `email` TEXT UNIQUE
- `password_hash` TEXT
- `full_name` TEXT
- `role` TEXT DEFAULT 'user' (`'user'` \| `'admin'`)
- `verification_token`, `verification_token_expires_at`
- `reset_token`, `reset_token_expires_at`
- `created_at`, `updated_at`

**`error_logs`** — method, path, status_code, error_type, message, detail, traceback_text, endpoint, request_id, source, created_at

**`system_settings`** — `key` PK TEXT, `value` TEXT, `updated_by` → users(id), `updated_at`

Row Level Security: **not enabled** — authorization is enforced in the API layer (session cookies).

### Seed (`database/seed.sql`)
- Admin: `admin@apptemplate.in` / `Admin@1234` (id `a1111111-...`)
- Demo user: `user@apptemplate.in` / `User@1234` (id `b1111111-...`)
- Default settings: app_name, support_email, session_timeout_days=1, require_email_verification=false


## 7. Authentication & Session Flow

1. **Login**: verify email + bcrypt password → sign JWT (`role: "user"`) → set `app_session` cookie (httpOnly, sameSite lax, secure in production, 30-day TTL) → redirect `/app`
2. **Register**: create user → generate verification token (48h) → send verification email via Resend → auto-create session → redirect `/app`
3. **Email verification**: GET `/api/auth/verify-email?token=` → clear token → redirect `/login?verified=1`
4. **Forgot password**: lookup email → generate reset token (1h) → store `reset_token`/`reset_token_expires_at` → email reset link (always returns "if registered, link sent" for user enumeration safety)
5. **Reset password**: validate token + expiry → hash new password → clear tokens → redirect to login
6. **Logout**: clear `app_session` cookie
7. **Session read**: Server Components/route handlers read cookie via `next/headers.cookies()`; client components read `document.cookie`

> JWT payload only carries `sub` (userId) and `role` — admin status is derived from `users.role` at request time.

## 8. Settings System

Defined in `lib/settings/registry.js` under sections **Application** and **Security**:

| Key | Type | Default |
|-----|------|---------|
| `app_name` | text | App Template |
| `support_email` | email | support@yourapp.in |
| `session_timeout_days` | number (1–365) | 1 |
| `require_email_verification` | boolean | false |

`lib/settings/service.js` reads through `system_settings` table with per-request caching; falls back to registry defaults. Admin UI for editing settings is **not implemented**.

## 9. Email

Provider: **Resend** (`lib/core/email.js`).
- Verification email (register)
- Password reset link (forgot password)
- If `RESEND_API_KEY` is missing, `sendEmail` is a no-op that logs to console (safe for local dev without email)

Links use `appBaseUrl(request)` (headers `origin` / `x-forwarded-host`, fallback `NEXT_PUBLIC_APP_URL`).

## 10. Error Handling

- `app/error.js` — React error boundary for the root layout (shows "Something went wrong" + Try again)
- `lib/core/error-log.js` — server-side error logging to `error_logs` table with type classification (API_ERROR / VALIDATION / HTTP / INTERNAL)
- API routes wrap logic in try/catch and return JSON `{ error }` with proper HTTP status codes
- Client toasts via `components/ui/Toaster.js` (custom `kutumb-toast` event; last 2 toasts retained, auto-dismiss 3.5s)

## 11. Deployment — Cloudflare Workers (OpenNext)

| File | Purpose |
|------|---------|
| `wrangler.toml` | Worker entry `.open-next/worker.js`, assets dir `.open-next/assets`, env vars |
| `open-next.config.ts` | OpenNext Cloudflare config |
| `package.json` scripts | see §12 |

**Deploy:**
```bash
npm run build:cf    # opennextjs-cloudflare build
npm run deploy:cf   # build + deploy to Cloudflare production
npm run cf:dev      # wrangler dev locally
```

**Required environment variables (set in wrangler.toml / platform):**
`DATABASE_URL`, `NEXT_PUBLIC_APP_URL`, `JWT_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`

⚠️ **Security**: never commit real credentials. `.env` is gitignored; use `.env.example` as a template. The committed `wrangler.toml` contains placeholders only — replace before deploying.

## 12. Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server (http://localhost:3000) |
| `npm run build` | Production build (`next build --webpack`) |
| `npm run start` | Start production server |
| `npm run build:cf` | Build for Cloudflare Workers (OpenNext) |
| `npm run deploy:cf` | Build and deploy to Cloudflare production |
| `npm run cf:dev` | Local dev with wrangler |

> Older docs referenced `npm run test:run` and `npm run lint` — those scripts do not exist in `package.json`. ESLint and Vitest are installed as devDependencies but no configs/scripts are wired up.

## 13. Environment Variables

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | `postgres://...` | PostgreSQL connection string |
| `JWT_SECRET` | Yes | random string | Signing key for session JWTs |
| `NEXT_PUBLIC_APP_URL` | Yes | `https://app.example.com` | Base URL for auth email links |
| `RESEND_API_KEY` | No* | `re_xxx` | Resend API key (email disabled if absent) |
| `EMAIL_FROM` | No | `App <no-reply@example.com>` | Sender address |
| `NODE_ENV` | No | `development` | Affects cookie `secure` flag |

\* Email features silently no-op without it.


## 14. Security Notes

- Session stored in httpOnly `app_session` cookie (XSS-resistant)
- Passwords hashed with bcrypt (10 rounds)
- Auth routes are stateless JWT verification + DB user lookup
- Admin routes enforce `role === 'admin'` on every request
- Password reset / verify tokens are cleared after use and time-limited
- Forgot-password endpoint does not reveal whether an email exists
- **No RLS on PostgreSQL** — authorization is application-layer only
- `error_logs` stores raw messages/traces — avoid logging secrets

## 15. Known Limitations / Cleanup Notes

- `getCurrentUser()` tries server-side first and falls back to client-side on any error; if the DB is unreachable, protected routes can loop
- `updateUser` in `lib/auth/admin.js` requires at least one field; an admin can demote themselves (no self-demote guard)
- No "System Settings" admin UI page exists yet (settings editable only via DB/seed)
- No social login (Google link was removed — `/api/auth/google` did not exist)
- No `public/` assets — favicon/og-image metadata references were removed
- No tests configured despite Vitest/ESLint being installed
- `next.config.mjs` sets `NEXT_PUBLIC_APP_VERSION` from `package.json` for the version banner
- Version banner (`components/ui/VersionBanner.js`) notifies clients when a newly deployed version differs from localStorage

## 16. Quick Start

```bash
# 1. Install
npm install

# 2. Environment
cp .env.example .env
# edit .env with DATABASE_URL, JWT_SECRET, NEXT_PUBLIC_APP_URL, RESEND_API_KEY

# 3. Database
psql $DATABASE_URL < database/schema.sql
psql $DATABASE_URL < database/seed.sql

# 4. Develop
npm run dev
```

Default seed credentials: admin `admin@apptemplate.in` / `Admin@1234`; user `user@apptemplate.in` / `User@1234`.

