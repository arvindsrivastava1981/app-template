-- =============================================================================
-- App Template — Database Schema (DDL)
-- =============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. Users (Authentication & Roles)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    auth_provider TEXT NOT NULL DEFAULT 'email',
    provider_user_id TEXT,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',          -- 'user' | 'admin'
    is_admin BOOLEAN DEFAULT FALSE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    verification_token TEXT,
    verification_token_expires_at TIMESTAMPTZ,
    reset_token TEXT,
    reset_token_expires_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_provider_account UNIQUE (auth_provider, provider_user_id)
);

-- -----------------------------------------------------------------------------
-- 2. System Settings (key-value store for admin configuration)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. Error Logs (admin visibility into API errors)
-- -----------------------------------------------------------------------------
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
-- 4. Row Level Security (RLS)
-- -----------------------------------------------------------------------------
-- Users can read their own record; admins can read all.
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;

CREATE POLICY users_self_read ON users
  FOR SELECT
  USING (
    id = NULLIF(current_setting('app.current_user_id', true), '')::uuid
    OR
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = NULLIF(current_setting('app.current_user_id', true), '')::uuid
      AND (u.is_admin = true OR u.role = 'admin')
    )
  );

-- Admins can manage all users; users can update their own record.
CREATE POLICY users_admin_all ON users
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = NULLIF(current_setting('app.current_user_id', true), '')::uuid
      AND (u.is_admin = true OR u.role = 'admin')
    )
  );

CREATE POLICY users_self_update ON users
  FOR UPDATE
  USING (
    id = NULLIF(current_setting('app.current_user_id', true), '')::uuid
  );

-- System settings: readable by all authenticated, writable by admins.
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings FORCE ROW LEVEL SECURITY;

CREATE POLICY settings_read ON system_settings
  FOR SELECT
  USING (true);

CREATE POLICY settings_admin_write ON system_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = NULLIF(current_setting('app.current_user_id', true), '')::uuid
      AND (u.is_admin = true OR u.role = 'admin')
    )
  );

-- Error logs: readable by admins only.
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs FORCE ROW LEVEL SECURITY;

CREATE POLICY error_logs_admin_read ON error_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = NULLIF(current_setting('app.current_user_id', true), '')::uuid
      AND (u.is_admin = true OR u.role = 'admin')
    )
  );