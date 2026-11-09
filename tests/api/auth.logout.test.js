import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";
import { buildMockDb, resetMockDb } from "./mockDb";
import { makeRequest } from "./helpers";

const mockDb = buildMockDb();
const mockLogError = vi.fn(async () => true);

vi.mock("@/lib/core/db", () => ({ db: mockDb }));
vi.mock("@/lib/core/error-log", () => ({ logError: mockLogError }));

let POST;
beforeAll(async () => {
  const mod = await import("@/app/api/auth/logout/route");
  POST = mod.POST;
});

beforeEach(() => {
  resetMockDb(mockDb);
  mockLogError.mockReset();
});

const URL = "http://localhost:3000/api/auth/logout";

describe("POST /api/auth/logout", () => {
  it("returns 200 and clears the session cookie", async () => {
    const res = await POST(makeRequest(URL, { method: "POST" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.message).toBe("Logged out successfully.");
    const cookie = res.headers.get("set-cookie") || "";
    expect(cookie).toContain("app_session=");
    expect(cookie).toContain("Max-Age=0");
  });
});
