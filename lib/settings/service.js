import { db } from "../core/db";
import { requestCache, requestCacheSet } from "../core/request-cache";
import {
  SETTINGS,
  DEFAULT_SETTINGS,
  SETTING_KEYS,
  coerceSettingValue,
  serializeSettingValue,
  mergeSettings,
} from "./registry";

const SETTINGS_CACHE_KEY = "systemSettings";

export async function getSystemSettings() {
  return requestCache(SETTINGS_CACHE_KEY, async () => {
    const rows = await readSettingRows();
    return mergeSettings(rows);
  });
}

export async function getSetting(key) {
  const settings = await getSystemSettings();
  return settings[key] ?? DEFAULT_SETTINGS[key] ?? null;
}

async function readSettingRows() {
  return await db.systemSetting.findMany({
    select: { key: true, value: true },
  });
}

export async function updateSystemSettings(entries, userId = null) {
  const updates = [];

  for (const [key, raw] of Object.entries(entries || {})) {
    const def = SETTINGS[key];
    if (!def) return { ok: false, error: `Unknown setting: ${key}` };

    const coerced = coerceSettingValue(def, raw);
    if (!coerced.ok) return { ok: false, error: `${def.label}: ${coerced.error}` };

    updates.push({ key, value: serializeSettingValue(def, coerced.value) });
  }

  if (!updates.length) return { ok: false, error: "No settings to update." };

  try {
    await db.$transaction(
      updates.map((u) =>
        db.systemSetting.upsert({
          where: { key: u.key },
          update: { value: u.value, updated_by: userId },
          create: { key: u.key, value: u.value, updated_by: userId },
        })
      )
    );

    const settings = mergeSettings(await readSettingRows());
    requestCacheSet(SETTINGS_CACHE_KEY, settings);
    return { ok: true, settings };
  } catch (err) {
    console.error("[settings] update failed:", err.message);
    return { ok: false, error: "Could not save settings. Please try again." };
  }
}