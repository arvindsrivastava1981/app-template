export const SETTING_TYPES = {
  TEXT: "text",
  EMAIL: "email",
  NUMBER: "number",
  BOOLEAN: "boolean",
};

export const LOGIN_LOCKOUT_MINUTES = 15;

export const SETTING_SECTIONS = [
  {
    id: "application",
    title: "Application Settings",
    description: "Configure general application parameters",
    icon: "Settings",
    settings: [
      {
        key: "app_name",
        label: "App Name",
        description: "Shown in signed-in navigation, admin page titles and outgoing emails.",
        type: SETTING_TYPES.TEXT,
        default: "App Template",
        placeholder: "App Template",
      },
      {
        key: "support_email",
        label: "Support Email",
        description: "Contact address shown to users and included in transactional emails.",
        type: SETTING_TYPES.EMAIL,
        default: "support@yourapp.in",
        placeholder: "support@example.com",
      },
    ],
  },
  {
    id: "security",
    title: "Security Settings",
    description: "Authentication and security configuration",
    icon: "Shield",
    settings: [
      {
        key: "session_timeout_days",
        label: "Session Timeout",
        description: "How long a signed-in session stays valid before the user must sign in again.",
        type: SETTING_TYPES.NUMBER,
        default: 30,
        min: 1,
        max: 365,
        unit: "days",
      },
      {
        key: "require_email_verification",
        label: "Require Email Verification",
        description: "Users must verify their email before signing in.",
        type: SETTING_TYPES.BOOLEAN,
        default: false,
      },
    ],
  },
];

export const SETTINGS = Object.fromEntries(
  SETTING_SECTIONS.flatMap((section) =>
    section.settings.map((def) => [def.key, { ...def, sectionId: section.id }])
  )
);

export const SETTING_KEYS = Object.keys(SETTINGS);

export const DEFAULT_SETTINGS = Object.fromEntries(
  SETTING_KEYS.map((key) => [key, SETTINGS[key].default])
);

export function settingDef(key) {
  return SETTINGS[key];
}

export function isValidEmail(value) {
  return /^\S+@\S+\.\S+$/.test(String(value ?? "").trim());
}

export function coerceSettingValue(def, raw) {
  if (!def) return { ok: false, error: "Unknown setting" };

  if (def.type === SETTING_TYPES.BOOLEAN) {
    if (typeof raw === "boolean") return { ok: true, value: raw };
    const s = String(raw ?? "").trim().toLowerCase();
    if (["true", "1", "on", "yes", "enabled"].includes(s)) return { ok: true, value: true };
    if (["false", "0", "off", "no", "disabled", ""].includes(s)) return { ok: true, value: false };
    return { ok: false, error: "Must be on or off" };
  }

  if (def.type === SETTING_TYPES.NUMBER) {
    const n = Number(raw);
    if (!Number.isFinite(n)) return { ok: false, error: "Must be a number" };
    const min = def.min ?? -Infinity;
    const max = def.max ?? Infinity;
    if (n < min) return { ok: false, error: `Must be at least ${min}` };
    if (n > max) return { ok: false, error: `Must be at most ${max}` };
    return { ok: true, value: n };
  }

  if (def.type === SETTING_TYPES.EMAIL) {
    const s = String(raw ?? "").trim();
    if (!isValidEmail(s)) return { ok: false, error: "Enter a valid email address" };
    return { ok: true, value: s.toLowerCase() };
  }

  const s = String(raw ?? "").trim();
  if (!s) return { ok: false, error: "Required" };
  return { ok: true, value: s };
}

export function serializeSettingValue(def, value) {
  if (!def) return String(value ?? "");
  if (def.type === SETTING_TYPES.BOOLEAN) return value ? "true" : "false";
  return String(value ?? "");
}

export function mergeSettings(storedRows = []) {
  const byKey = new Map(storedRows.map((r) => [r.key, r.value]));
  const out = { ...DEFAULT_SETTINGS };
  for (const key of SETTING_KEYS) {
    if (!byKey.has(key)) continue;
    const coerced = coerceSettingValue(SETTINGS[key], byKey.get(key));
    if (coerced.ok) out[key] = coerced.value;
  }
  return out;
}

export function sessionTtlSeconds(settings) {
  const days = Number(settings?.session_timeout_days);
  const safeDays = Number.isFinite(days) && days > 0 ? days : DEFAULT_SETTINGS.session_timeout_days;
  return Math.round(safeDays * 24 * 60 * 60);
}