# Backend

This folder contains the backend code for the App Template.

## Contents

- `lib/auth/` — Authentication (session, password, admin, current-user)
- `lib/core/` — Core services (database, email, app-url, error-log, request-cache)
- `lib/settings/` — System settings (registry, service)
- `lib/public/` — Public branding constants

## Key Modules

### Auth
- `session.js` — JWT session management (jose, httpOnly cookie)
- `password.js` — bcrypt password hashing and verification
- `admin.js` — Admin role management, user CRUD
- `current-user.js` — Get current authenticated user from session

### Core
- `db.js` — Neon/PostgreSQL database connection
- `email.js` — Resend email sending
- `app-url.js` — Resolve base URL from request headers
- `error-log.js` — Error logging to database
- `request-cache.js` — Per-request cache using AsyncLocalStorage

### Settings
- `registry.js` — Setting definitions, defaults, coercion
- `service.js` — Get/update system settings with caching