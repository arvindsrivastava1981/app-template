import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";
import { buildMockDb, resetMockDb } from "./mockDb";
import { makeRequest } from "./helpers";

const mockDb = buildMockDb();
const mockHashPassword = vi.fn(async () => "hashed-password");
const mockCreateSessionToken = vi.fn(async () => "mock-session-token");
const mockSendEmail = vi.fn(async () => ({ ok: true }));
const mockAppBaseUrl = vi.fn(() => "http://localhost:3000");
const mockLogError = vi.fn(async () => true);

vi.mock("@/lib/core/db", () => ({ db: mockDb }));
vi.mock("@/lib/auth/password", () => ({ hashPassword: mockHashPassword }));
vi.mock("@/lib/auth/session", () => ({
  COOKIE_NAME: "app_session",
  SESSION_TTL_SECONDS: 60 * 60 * 24 * 30,
  normalizeEmail: (e) => String(e || "").trim().toLowerCase(),
  createSessionToken: mockCreateSessionToken,
}));
vi.mock("@/lib/core/email", () => ({ sendEmail: mockSendEmail }));
vi.mock("@/lib/core/app-url", () => ({ appBaseUrl: mockAppBaseUrl }));
vi.mock("@/lib/core/error-log", () => ({ logError: mockLogError }));

let POST;
beforeAll(async () => {
  const mod = await import("@/app/api/auth/register/route");
  POST = mod.POST;
});

beforeEach(() => {
  resetMockDb(mockDb);
  mockHashPassword.mockReset();
  mockCreateSessionToken.mockReset();
  mockSendEmail.mockReset();
  mockAppBaseUrl.mockReset();
  mockLogError.mockReset();
});

const URL = "http://localhost:3000/api/auth/register";

describe("POST /api/auth/register", () => {
  it("returns 400 for an invalid email", async () => {
    const res = await POST(makeRequest(URL, { method: "POST", body: { email: "not-an-email", password: "password123", full_name: "Ada" } }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("Enter a valid email address.");
  });

  it("returns 400 for a short password", async () => {
    const res = await POST(makeRequest(URL, { method: "POST", body: { email: "a@b.com", password: "short", full_name: "Ada" } }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when full name is missing", async () => {
    const res = await POST(makeRequest(URL, { method: "POST", body: { email: "a@b.com", password: "password123" } }));
    expect(res.status).toBe(400);
  });

  it("returns 409 when email already exists", async () => {
    mockDb.user.findUnique.mockResolvedValue({ id: "existing" });
    const res = await POST(makeRequest(URL, { method: "POST", body: { email: "a@b.com", password: "password123", full_name: "Ada" } }));
    expect(res.status).toBe(409);
  });

  it("returns 201, creates the user, sends email and sets cookie on success", async () => {
    mockDb.user.findUnique.mockResolvedValue(null);
    mockDb.user.create.mockResolvedValue({ id: "new-id", email: "a@b.com" });
    const res = await POST(makeRequest(URL, { method: "POST", body: { email: "a@b.com", password: "password123", full_name: "Ada Lovelace" } }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(mockHashPassword).toHaveBeenCalledWith("password123");
    expect(mockDb.user.create).toHaveBeenCalled();
    expect(mockSendEmail).toHaveBeenCalled();
    expect(mockCreateSessionToken).toHaveBeenCalledWith(expect.any(String), expect.any(Number), "user");
    const cookie = res.headers.get("set-cookie") || "";
    expect(cookie).toContain("app_session=mock-session-token");
  });
});
