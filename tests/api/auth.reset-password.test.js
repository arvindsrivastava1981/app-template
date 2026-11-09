import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";
import { buildMockDb, resetMockDb } from "./mockDb";
import { makeRequest } from "./helpers";

const mockDb = buildMockDb();
const mockHashPassword = vi.fn(async () => "hashed-password");
const mockLogError = vi.fn(async () => true);
const mockLogStatusError = vi.fn(async () => true);

vi.mock("@/lib/core/db", () => ({ db: mockDb }));
vi.mock("@/lib/auth/password", () => ({ hashPassword: mockHashPassword }));
vi.mock("@/lib/core/error-log", () => ({ logError: mockLogError, logStatusError: mockLogStatusError }));

let POST;
beforeAll(async () => {
  const mod = await import("@/app/api/auth/reset-password/route");
  POST = mod.POST;
});

beforeEach(() => {
  resetMockDb(mockDb);
  mockHashPassword.mockReset();
  mockLogError.mockReset();
  mockLogStatusError.mockReset();
});

const URL = "http://localhost:3000/api/auth/reset-password";

describe("POST /api/auth/reset-password", () => {
  it("returns 400 for a short password", async () => {
    const res = await POST(makeRequest(URL, { method: "POST", body: { token: "abc", password: "short" } }));
    expect(res.status).toBe(400);
    expect(mockLogStatusError).toHaveBeenCalled();
  });

  it("returns 400 for an invalid or expired token", async () => {
    mockDb.user.findFirst.mockResolvedValue(null);
    const res = await POST(makeRequest(URL, { method: "POST", body: { token: "abc", password: "password123" } }));
    expect(res.status).toBe(400);
  });

  it("returns 200 and clears the reset token on success", async () => {
    mockDb.user.findFirst.mockResolvedValue({ id: "u1" });
    mockDb.user.update.mockResolvedValue({ id: "u1" });
    const res = await POST(makeRequest(URL, { method: "POST", body: { token: "abc", password: "password123" } }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(mockHashPassword).toHaveBeenCalledWith("password123");
    expect(mockDb.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: { password_hash: "hashed-password", reset_token: null, reset_token_expires_at: null },
    });
  });
});
