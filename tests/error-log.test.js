import { describe, it, expect, beforeAll } from "vitest";
import { logError } from "@/lib/core/error-log";
import { db } from "@/lib/core/db";

describe("error_logs write path", () => {
  beforeAll(() => {
    if (!process.env.DATABASE_URL) {
      throw new Error("[SETUP] DATABASE_URL is not set. Create .env from .env.example and point it at your Postgres DB.");
    }
  });

  it("writes an error to error_logs and can read it back", async () => {
    let writeResult;
    try {
      writeResult = await logError({
        endpoint: "tests/error-log",
        status_code: 500,
        message: "Test error from backend test",
        traceback_text: new Error("boom").stack,
        source: "TEST",
      });
    } catch (err) {
      console.error("[STEP: logError insert] failed:", err);
      throw err;
    }

    try {
      expect(writeResult).toBe(true);
    } catch (err) {
      console.error("[STEP: assert logError returned true] failed: writeResult =", writeResult);
      throw err;
    }

    let rows;
    try {
      rows = await db.errorLog.findMany({
        where: {
          message: "Test error from backend test",
          source: "TEST",
        },
        orderBy: { created_at: "desc" },
        take: 1,
        select: { id: true, message: true, source: true, status_code: true },
      });
    } catch (err) {
      console.error("[STEP: prisma errorLog.findMany] failed:", err);
      throw err;
    }

    try {
      expect(rows.length).toBeGreaterThan(0);
    } catch (err) {
      console.error("[STEP: assert rows.length > 0] failed:", err);
      throw err;
    }

    try {
      expect(rows[0].message).toBe("Test error from backend test");
    } catch (err) {
      console.error("[STEP: assert rows[0].message] failed:", err);
      throw err;
    }

    try {
      expect(rows[0].source).toBe("TEST");
    } catch (err) {
      console.error("[STEP: assert rows[0].source] failed:", err);
      throw err;
    }

    try {
      expect(rows[0].status_code).toBe(500);
    } catch (err) {
      console.error("[STEP: assert rows[0].status_code] failed:", err);
      throw err;
    }

    try {
      expect(rows[0].id).toBeDefined();
    } catch (err) {
      console.error("[STEP: assert rows[0].id defined] failed:", err);
      throw err;
    }
  });
});
