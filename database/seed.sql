-- =============================================================================
-- App Template — Seed Data
-- =============================================================================
BEGIN;

TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- -----------------------------------------------------------------------------
-- 1. Demo users (passwords are bcrypt 10-round hashes)
-- -----------------------------------------------------------------------------
INSERT INTO users (id, email, password_hash, full_name, role, created_at) VALUES
  ('a1111111-1111-1111-1111-111111111111',
   'admin@apptemplate.in',
   '$2b$10$SzOoC3GoGv13fvwT7.I.vOb.tb9Lm1rFZsSnN6XwGKE8W7kHoWiPq',
   'System Administrator',
   'admin',
   NOW()),
  ('b1111111-1111-1111-1111-111111111111',
   'user@apptemplate.in',
   '$2b$10$tIxsDB2YWWntzLiPD9EasuOHGgkyvx7bda0SnOH679sW54O6ubn66',
   'Demo User',
   'user',
   NOW());


   -- -----------------------------------------------------------------------------
-- 3. Default System Settings
-- -----------------------------------------------------------------------------
INSERT INTO system_settings (key, value, updated_at) VALUES
  ('app_name', 'App Template', NOW()),
  ('support_email', 'support@yourapp.in', NOW()),
  ('session_timeout_days', '1', NOW()),
  ('require_email_verification', 'false', NOW());

COMMIT;