import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";
import { buildMockDb, resetMockDb } from "./mockDb";
import { makeRequest } from "./helpers";

const mockDb = buildMockDb();
const mockGetCurrentUser = vi.fn(async () => ({ user: { id: "u1", email: "a@b.com", full_name: "Ada", role: "user" } }));
const mockVerifyPassword = vi.fn();
const mockHashPassword = vi.fn(async () => "hashed-password");
const mockLogError = vi.fn(async () => true);

vi.mock("@/lib/auth/current-user.server", () => ({ getCurrentUser: mockGetCurrentUser }));
vi.mock("@/lib/auth/password", () => ({ verifyPassword: mockVerifyPassword, hashPassword: mockHashPassword }));
vi.mock("@/lib/core/db", () => ({ db: mockDb }));
vi.mock("@/lib/core/error-log", () => ({ logError: mockLogError }));

let PATCH;
beforeAll(async () => {
  const mod = await import("@/app/api/me/password/route");
  PATCH = mod.PATCH;
});

beforeEach(() => {
  resetMockDb(mockDb);
  mockGetCurrentUser.mockReset();
  mockVerifyPassword.mockReset();
  mockHashPassword.mockReset();
  mockLogError.mockReset();
});

const URL = "http://localhost:3000/api/me/password";

describe("PATCH /api/me/password", () => {
  it("returns 401 when not authenticated", async () => {
    mockGetCurrentUser.mockResolvedValue(null);
    const res = await PATCH(makeRequest(URL, { method: "PATCH", body: { current_password: "x", new_password: "newpass123" } }));
    expect(res.status).toBe(401);
  });

  it("returns 400 when fields are missing", async () => {
    const res = await PATCH(makeRequest(URL, { method: "PATCH", body: { current_password: "x" } }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for a short new password", async () => {
    const res = await PATCH(makeRequest(URL, { method: "PATCH", body: { current_password: "x", new_password: "short" } }));
    expect(res.status).toBe(400);
  });

  it("returns 404 when user is not found", async () => {
    mockDb.user.findUnique.mockResolvedValue(null);
    const res = await PATCH(makeRequest(URL, { method: "PATCH", body: { current_password: "x", new_password: "newpass123" } }));
    expect(res.status).toBe(404);
  });

  it("returns 401 when current password is incorrect", async () => {
    mockDb.user.findUnique.mockResolvedValue({ password_hash: "hash" });
    mockVerifyPassword.mockResolvedValue(false);
    const res = await PATCH(makeRequest(URL, { method: "PATCH", body: { current_password: "x", new_password: "newpass123" } }));
    expect(res.status).toBe(401);
  });

  it("returns 200 and updates the password on success", async () => {
    mockDb.user.findUnique.mockResolvedValue({ password_hash: "hash" });
    mockVerifyPassword.mockResolvedValue(true);
    mockDb.user.update.mockResolvedValue({ id: "u1" });
    const res = await PATCH(makeRequest(URL, { method: "PATCH", body: { current_password: "x", new_password: "newpass123" } }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(mockHashPassword).toHaveBeenCalledWith("newpass123");
    expect(mockDb.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: { password_hash: "hashed-password" },
    });
  });
});
