import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";
import { buildMockDb, resetMockDb } from "./mockDb";
import { makeRequest } from "./helpers";

const mockDb = buildMockDb();
const mockVerifyPassword = vi.fn();
const mockCreateSessionToken = vi.fn(async () => "mock-session-token");
const mockLogError = vi.fn(async () => true);
const mockLogStatusError = vi.fn(async () => true);

vi.mock("@/lib/core/db", () => ({ db: mockDb }));
vi.mock("@/lib/auth/password", () => ({ verifyPassword: mockVerifyPassword }));
vi.mock("@/lib/auth/session", () => ({
  COOKIE_NAME: "app_session",
  SESSION_TTL_SECONDS: 60 * 60 * 24 * 30,
  normalizeEmail: (e) => String(e || "").trim().toLowerCase(),
  createSessionToken: mockCreateSessionToken,
}));
vi.mock("@/lib/core/error-log", () => ({
  logError: mockLogError,
  logStatusError: mockLogStatusError,
}));

let POST;
beforeAll(async () => {
  const mod = await import("@/app/api/auth/login/route");
  POST = mod.POST;
});

beforeEach(() => {
  resetMockDb(mockDb);
  mockVerifyPassword.mockReset();
  mockCreateSessionToken.mockReset();
  mockLogError.mockReset();
  mockLogStatusError.mockReset();
});

const URL = "http://localhost:3000/api/auth/login";

describe("POST /api/auth/login", () => {
  it("returns 400 when email or password is missing", async () => {
    const res = await POST(makeRequest(URL, { method: "POST", body: { email: "a@b.com" } }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Email and password are required.");
  });

  it("returns 401 when user does not exist", async () => {
    mockDb.user.findUnique.mockResolvedValue(null);
    const res = await POST(makeRequest(URL, { method: "POST", body: { email: "a@b.com", password: "password123" } }));
    expect(res.status).toBe(401);
  });

  it("returns 401 when password is incorrect", async () => {
    mockDb.user.findUnique.mockResolvedValue({ id: "u1", email: "a@b.com", password_hash: "hash", full_name: "A" });
    mockVerifyPassword.mockResolvedValue(false);
    const res = await POST(makeRequest(URL, { method: "POST", body: { email: "a@b.com", password: "wrong" } }));
    expect(res.status).toBe(401);
    expect(mockVerifyPassword).toHaveBeenCalledWith("wrong", "hash");
  });

  it("returns 200 and sets session cookie on success", async () => {
    mockDb.user.findUnique.mockResolvedValue({ id: "u1", email: "a@b.com", password_hash: "hash", full_name: "A" });
    mockVerifyPassword.mockResolvedValue(true);
    const res = await POST(makeRequest(URL, { method: "POST", body: { email: "a@b.com", password: "password123" } }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.message).toBe("Login successful.");
    expect(mockCreateSessionToken).toHaveBeenCalledWith("u1", expect.any(Number), "user");
    const cookie = res.headers.get("set-cookie") || "";
    expect(cookie).toContain("app_session=mock-session-token");
  });

  it("returns 500 when the user lookup fails", async () => {
    mockDb.user.findUnique.mockRejectedValue(new Error("db down"));
    const res = await POST(makeRequest(URL, { method: "POST", body: { email: "a@b.com", password: "password123" } }));
    expect(res.status).toBe(500);
    expect(mockLogError).toHaveBeenCalled();
  });
});
