import { vi } from "vitest";

// In-memory mock of the Prisma client so API route tests run deterministically
// without a live Postgres database. Route logic (validation, auth, responses)
// is exercised; real DB integration is covered by tests/db.connection.test.js
// and tests/error-log.test.js.
export function buildMockDb() {
  return {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
      findMany: vi.fn(),
    },
    errorLog: {
      create: vi.fn(),
      findMany: vi.fn(),
      aggregate: vi.fn(),
    },
    systemSetting: {
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
    $queryRaw: vi.fn(),
    $transaction: vi.fn(async (calls) => Promise.all(calls)),
  };
}

export function resetMockDb(db) {
  for (const key of ["$queryRaw", "$transaction"]) {
    if (db[key] && typeof db[key].mockReset === "function") db[key].mockReset();
  }
  for (const group of Object.values(db)) {
    if (group && typeof group === "object" && !Array.isArray(group)) {
      for (const fn of Object.values(group)) {
        if (fn && typeof fn.mockReset === "function") fn.mockReset();
      }
    }
  }
}
