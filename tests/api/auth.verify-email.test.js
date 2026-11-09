import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";
import { buildMockDb, resetMockDb } from "./mockDb";
import { makeRequest } from "./helpers";

const mockDb = buildMockDb();
const mockLogError = vi.fn(async () => true);
const mockLogStatusError = vi.fn(async () => true);

vi.mock("@/lib/core/db", () => ({ db: mockDb }));
vi.mock("@/lib/core/error-log", () => ({ logError: mockLogError, logStatusError: mockLogStatusError }));

let GET;
beforeAll(async () => {
  const mod = await import("@/app/api/auth/verify-email/route");
  GET = mod.GET;
});

beforeEach(() => {
  resetMockDb(mockDb);
  mockLogError.mockReset();
  mockLogStatusError.mockReset();
});

describe("GET /api/auth/verify-email", () => {
  it("returns 400 when token is missing", async () => {
    const res = await GET(makeRequest("http://localhost:3000/api/auth/verify-email"));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("Missing verification token.");
  });

  it("returns 400 for an invalid or expired token", async () => {
    mockDb.user.findFirst.mockResolvedValue(null);
    const res = await GET(makeRequest("http://localhost:3000/api/auth/verify-email?token=bad"));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("This verification link is invalid or has expired.");
  });

  it("clears the token and redirects to /login?verified=1 on success", async () => {
    mockDb.user.findFirst.mockResolvedValue({ id: "u1" });
    mockDb.user.update.mockResolvedValue({ id: "u1" });
    const res = await GET(makeRequest("http://localhost:3000/api/auth/verify-email?token=good"));
    expect(res.status).toBe(307); // NextResponse.redirect defaults to 307
    expect(res.headers.get("location")).toContain("/login?verified=1");
    expect(mockDb.user.update).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: { verification_token: null, verification_token_expires_at: null },
    });
  });
});
