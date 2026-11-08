import { describe, it, expect, beforeAll } from "vitest";
import { db } from "@/lib/core/db";

describe("database connection", () => {
  beforeAll(() => {
    if (!process.env.DATABASE_URL) {
      throw new Error("[SETUP] DATABASE_URL is not set. Create .env from .env.example and point it at your Postgres DB.");
    }
  });

  it("can connect and run a simple query", async () => {
    let result;
    try {
      result = await db.$queryRaw`SELECT 1 AS ok`;
    } catch (err) {
      console.error("[STEP: prisma \$queryRaw SELECT 1] failed:", err);
      throw err;
    }

    try {
      expect(result[0].ok).toBe(1);
    } catch (err) {
      console.error("[STEP: assert result[0].ok === 1] failed:", err);
      throw err;
    }
  });

  it("error_logs table is queryable", async () => {
    let result;
    try {
      result = await db.errorLog.aggregate({
        _count: true,
      });
    } catch (err) {
      console.error("[STEP: prisma errorLog.aggregate] failed:", err);
      throw err;
    }

    try {
      expect(result._count).toBeGreaterThanOrEqual(0);
    } catch (err) {
      console.error("[STEP: assert error_logs count >= 0] failed:", err);
      throw err;
    }
  });
});
