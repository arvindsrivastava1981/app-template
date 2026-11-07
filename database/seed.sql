-- =============================================================================
-- App Template — Seed Data
-- =============================================================================
BEGIN;

TRUNCATE TABLE error_logs, system_settings, users RESTART IDENTITY CASCADE;

-- -----------------------------------------------------------------------------
-- 1. Admin User (password = 'Admin@1234', bcrypt 10-round)
-- -----------------------------------------------------------------------------
INSERT INTO users (id, email, password_hash, full_name, role, is_admin, is_email_verified, created_at) VALUES
  ('a1111111-1111-1111-1111-111111111111',
   'admin@apptemplate.in',
   '$2b$10$SzOoC3GoGv13fvwT7.I.vOb.tb9Lm1rFZsSnN6XwGKE8W7kHoWiPq',
   'System Administrator',
   'admin',
   TRUE,
   TRUE,
   NOW());

-- -----------------------------------------------------------------------------
-- 2. Regular User (password = 'User@1234', bcrypt 10-round)
-- -----------------------------------------------------------------------------
INSERT INTO users (id, email, password_hash, full_name, role, is_admin, is_email_verified, created_at) VALUES
  ('b1111111-1111-1111-1111-111111111111',
   'user@apptemplate.in',
   '$2b$10$tIxsDB2YWWntzLiPD9EasuOHGgkyvx7bda0SnOH679sW54O6ubn66',
   'Demo User',
   'user',
   FALSE,
   TRUE,
   NOW());

-- -----------------------------------------------------------------------------
-- 3. Default System Settings
-- -----------------------------------------------------------------------------
INSERT INTO system_settings (key, value, updated_at) VALUES
  ('app_name', 'App Template', NOW()),
  ('support_email', 'support@yourapp.in', NOW()),
  ('session_timeout_days', '30', NOW()),
  ('require_email_verification', 'false', NOW());

COMMIT;