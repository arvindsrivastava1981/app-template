# App Template

A plug-and-play Next.js app template with authentication, user management, admin dashboard, profile, and password flows. Ready to drop into any project.

## Features

- **Authentication**: Login, signup, email verification, forgot/reset password, logout
- **Roles**: Admin and User with role-based access control
- **Admin Dashboard**: Create, list, update, and delete users
- **User Profile**: Update profile info and change password
- **Responsive**: Mobile-first design with Tailwind CSS 4, works on all devices
- **Security**: JWT session (httpOnly cookie), bcrypt password hashing, RLS-protected PostgreSQL
- **Deployment**: Cloudflare Workers via OpenNext, ready for production

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- PostgreSQL (Neon) with `@neondatabase/serverless`
- JWT authentication (jose)
- Password hashing (bcryptjs)
- Email (Resend)
- Cloudflare Workers (OpenNext)

## Folder Structure

```
app-template/
├─ app/              # Next.js App Router (pages, layouts, API routes)
├─ components/       # React components (UI, layout, auth)
├─ lib/              # Server libraries (auth, core, settings)
├─ database/         # SQL schema and seed files
├─ docs/             # APP-Template-MIND-MAP.MD — full project map
├─ package.json
├─ next.config.mjs
├─ wrangler.toml
├─ open-next.config.ts
├─ .env.example
├─ .gitignore
└─ README.md
```

## Quick Start

### 1. Install dependencies

```bash
cd app-template
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your DATABASE_URL, JWT_SECRET, NEXT_PUBLIC_APP_URL, RESEND_API_KEY
```

### 3. Set up the database

```bash
# Apply schema
psql $DATABASE_URL < database/schema.sql

# Seed with admin and demo user
psql $DATABASE_URL < database/seed.sql
```

Default credentials after seeding:
- Admin: `admin@apptemplate.in` / `Admin@1234`
- User: `user@apptemplate.in` / `User@1234`

### 4. Run development server

```bash
npm run dev
```

Open http://localhost:3000

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run build:cf` | Build for Cloudflare Workers |
| `npm run cf:dev` | Run with wrangler locally |

## Deployment (Cloudflare)

```bash
# Build and deploy
npm run deploy:cf

# Or build only
npm run build:cf

# Local dev with Cloudflare
npm run cf:dev
```

## Key Flows

### Authentication
- `GET /login` — Sign in page
- `GET /register` — Sign up page
- `GET /forgot-password` — Password reset request
- `GET /reset-password?token=xxx` — Password reset confirmation
- `GET /verify-email?token=xxx` — Email verification
- `POST /api/auth/login` — Login API
- `POST /api/auth/logout` — Logout API
- `POST /api/auth/register` — Register API
- `POST /api/auth/forgot-password` — Request reset
- `POST /api/auth/reset-password` — Confirm reset
- `GET /api/auth/verify-email` — Verify email

### User Profile (Authenticated)
- `GET /app/settings` — Profile & password page
- `PATCH /api/me/profile` — Update profile
- `PATCH /api/me/password` — Change password

### Admin (Admin only)
- `GET /admin` — Admin dashboard
- `GET /admin/users` — User management
- `GET /api/admin/users` — List users
- `POST /api/admin/users` — Create user
- `PATCH /api/admin/users` — Update user
- `DELETE /api/admin/users?id=xxx` — Delete user

## Customization

1. **App name**: Edit `lib/public/branding.js` or set `app_name` in system settings
2. **Support email**: Edit `SUPPORT_EMAIL` in `lib/public/branding.js`
3. **Styling**: Tailwind CSS 4 — edit `app/globals.css` and component classes
4. **Database**: Modify `database/schema.sql` for additional tables
5. **Deployment**: Update `wrangler.toml` with your domain and environment variables

## License

MIT