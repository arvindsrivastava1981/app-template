import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";
import { buildMockDb, resetMockDb } from "./mockDb";
import { makeRequest } from "./helpers";

const mockDb = buildMockDb();
const mockGetCurrentUser = vi.fn(async () => ({ user: { id: "u1", email: "a@b.com", full_name: "Ada", role: "user" } }));
const mockLogError = vi.fn(async () => true);

vi.mock("@/lib/auth/current-user.server", () => ({ getCurrentUser: mockGetCurrentUser }));
vi.mock("@/lib/core/db", () => ({ db: mockDb }));
vi.mock("@/lib/core/error-log", () => ({ logError: mockLogError }));

let PATCH;
beforeAll(async () => {
  const mod = await import("@/app/api/me/profile/route");
  PATCH = mod.PATCH;
});

beforeEach(() => {
  resetMockDb(mockDb);
  mockGetCurrentUser.mockReset();
  mockLogError.mockReset();
});

const URL = "http://localhost:3000/api/me/profile";

describe("PATCH /api/me/profile", () => {
  it("returns 401 when not authenticated", async () => {
    mockGetCurrentUser.mockResolvedValue(null);
    const res = await PATCH(makeRequest(URL, { method: "PATCH", body: { full_name: "Ada", email: "a@b.com" } }));
    expect(res.status).toBe(401);
  });

  it("returns 400 when fields are missing", async () => {
    const res = await PATCH(makeRequest(URL, { method: "PATCH", body: { full_name: "Ada" } }));
    expect(res.status).toBe(400);
  });

  it("returns 409 when email is already taken by another user", async () => {
    mockDb.user.findFirst.mockResolvedValue({ id: "other" });
    const res = await PATCH(makeRequest(URL, { method: "PATCH", body: { full_name: "Ada", email: "taken@b.com" } }));
    expect(res.status).toBe(409);
  });

  it("returns 200 and updates the profile on success", async () => {
    mockDb.user.findFirst.mockResolvedValue(null);
    mockDb.user.update.mockResolvedValue({ id: "u1" });
    const res = await PATCH(makeRequest(URL, { method: "PATCH", body: { full_name: "Ada Lovelace", email: "a@b.com" } }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(mockDb.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: { full_name: "Ada Lovelace", email: "a@b.com" },
    });
  });
});
