-- =============================================================================
-- App Template — Database Schema (DDL)
-- =============================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. Users (Authentication & Profile)
-- -----------------------------------------------------------------------------
-- Core identity columns only. Row Level Security is intentionally disabled —
-- the application enforces authorization in the API layer (session cookies),
-- not at the database level.
--
-- Note: verification_token / reset_token columns are retained because the
-- email-verify and forgot/reset flows (which the app keeps) cannot function
-- without token storage. All other columns from the previous schema were
-- dropped (auth_provider, provider_user_id, avatar_url, role, is_admin,
-- is_email_verified, last_login_at, failed_login_attempts, locked_until).
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    full_name TEXT,
    role TEXT DEFAULT 'user',          -- 'user' | 'admin'
    verification_token TEXT,
    verification_token_expires_at TIMESTAMPTZ,
    reset_token TEXT,
    reset_token_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. Error Logs (admin visibility into API errors)
-- -----------------------------------------------------------------------------
-- No Row Level Security: authorization is enforced in the API layer (admin-only
-- route handlers), not at the database level.
CREATE TABLE IF NOT EXISTS error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    method TEXT DEFAULT 'GET',
    path TEXT NOT NULL,
    status_code INTEGER NOT NULL,
    error_type TEXT NOT NULL,
    message TEXT NOT NULL,
    detail TEXT,
    traceback_text TEXT,
    endpoint TEXT,
    request_id TEXT,
    source TEXT DEFAULT 'BACKEND',
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- -----------------------------------------------------------------------------
-- 3. System Settings (key-value store for admin configuration)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);