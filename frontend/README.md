# Frontend

This folder contains the frontend code for the App Template.

## Contents

- `app/` — Next.js App Router pages, layouts, and API routes
- `components/` — React UI components
- `public/` — Static assets

## Key Pages

- `/` — Landing page
- `/login` — Sign in
- `/register` — Sign up
- `/forgot-password` — Password reset request
- `/reset-password?token=xxx` — Password reset confirmation
- `/verify-email?token=xxx` — Email verification
- `/app` — User dashboard (protected)
- `/app/settings` — Profile & password management (protected)
- `/admin` — Admin dashboard (admin only)
- `/admin/users` — User management (admin only)

## API Routes

- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout
- `POST /api/auth/register` — Register
- `POST /api/auth/forgot-password` — Request password reset
- `POST /api/auth/reset-password` — Confirm password reset
- `GET /api/auth/verify-email` — Verify email
- `GET /api/admin/users` — List users (admin)
- `POST /api/admin/users` — Create user (admin)
- `PATCH /api/admin/users` — Update user (admin)
- `DELETE /api/admin/users?id=xxx` — Delete user (admin)
- `PATCH /api/me/profile` — Update profile (authenticated)
- `PATCH /api/me/password` — Change password (authenticated)