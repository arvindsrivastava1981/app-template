import { describe, it, expect, beforeAll } from "vitest";
import { db } from "@/lib/core/db";

describe("database system_setting data", () => {
  beforeAll(() => {
    if (!process.env.DATABASE_URL) {
      throw new Error("[SETUP] DATABASE_URL is not set. Create .env from .env.example and point it at your Postgres DB.");
    }
  });

  it("can query system_setting table", async () => {
    let result;
    try {
      result = await db.systemSetting.findMany({
        select: { key: true, value: true },
        orderBy: { key: "asc" },
      });
    } catch (err) {
      console.error("[STEP: prisma systemSetting.findMany] failed:", err);
      throw err;
    }

    try {
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    } catch (err) {
      console.error("[STEP: assert systemSetting results] failed:", err);
      throw err;
    }
  });

  it("can find app_name setting", async () => {
    let result;
    try {
      result = await db.systemSetting.findUnique({
        where: { key: "app_name" },
        select: { key: true, value: true },
      });
    } catch (err) {
      console.error("[STEP: prisma systemSetting.findUnique app_name] failed:", err);
      throw err;
    }

    try {
      expect(result).toBeDefined();
      expect(result.key).toBe("app_name");
      expect(result.value).toBe("Bima VahanKhata");
    } catch (err) {
      console.error("[STEP: assert app_name value] failed:", err);
      throw err;
    }
  });

  it("can find all expected settings", async () => {
    const expectedKeys = ["app_name", "support_email", "session_timeout_days", "require_email_verification"];

    let result;
    try {
      result = await db.systemSetting.findMany({
        where: { key: { in: expectedKeys } },
        select: { key: true, value: true },
      });
    } catch (err) {
      console.error("[STEP: prisma systemSetting.findMany by keys] failed:", err);
      throw err;
    }

    try {
      expect(result).toBeDefined();
      const resultKeys = result.map((r) => r.key);
      expectedKeys.forEach((key) => {
        expect(resultKeys).toContain(key);
      });
    } catch (err) {
      console.error("[STEP: assert all expected keys present] failed:", err);
      throw err;
    }
  });

  it("system_setting values are not null", async () => {
    let result;
    try {
      result = await db.systemSetting.findMany({
        select: { key: true, value: true },
      });
    } catch (err) {
      console.error("[STEP: prisma systemSetting findAll] failed:", err);
      throw err;
    }

    try {
      expect(result).toBeDefined();
      result.forEach((r) => {
        expect(r.value).not.toBeNull();
        expect(r.value).toBeDefined();
      });
    } catch (err) {
      console.error("[STEP: assert systemSetting values non-null] failed:", err);
      throw err;
    }
  });
});