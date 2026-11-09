import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";
import { buildMockDb, resetMockDb } from "./mockDb";
import { makeRequest } from "./helpers";

const mockDb = buildMockDb();
const mockSendEmail = vi.fn(async () => ({ ok: true }));
const mockAppBaseUrl = vi.fn(() => "http://localhost:3000");
const mockLogError = vi.fn(async () => true);

vi.mock("@/lib/core/db", () => ({ db: mockDb }));
vi.mock("@/lib/core/email", () => ({ sendEmail: mockSendEmail }));
vi.mock("@/lib/core/app-url", () => ({ appBaseUrl: mockAppBaseUrl }));
vi.mock("@/lib/core/error-log", () => ({ logError: mockLogError }));

let POST;
beforeAll(async () => {
  const mod = await import("@/app/api/auth/forgot-password/route");
  POST = mod.POST;
});

beforeEach(() => {
  resetMockDb(mockDb);
  mockSendEmail.mockReset();
  mockAppBaseUrl.mockReset();
  mockLogError.mockReset();
});

const URL = "http://localhost:3000/api/auth/forgot-password";

describe("POST /api/auth/forgot-password", () => {
  it("returns 400 for an invalid email", async () => {
    const res = await POST(makeRequest(URL, { method: "POST", body: { email: "not-an-email" } }));
    expect(res.status).toBe(400);
  });

  it("returns 200 and issues a reset token for a valid email", async () => {
    mockDb.user.updateMany.mockResolvedValue({ count: 1 });
    const res = await POST(makeRequest(URL, { method: "POST", body: { email: "a@b.com" } }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(mockDb.user.updateMany).toHaveBeenCalledWith({
      where: { email: "a@b.com" },
      data: { reset_token: expect.any(String), reset_token_expires_at: expect.any(String) },
    });
    expect(mockSendEmail).toHaveBeenCalled();
  });
});
