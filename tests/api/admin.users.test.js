import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";
import { buildMockDb, resetMockDb } from "./mockDb";
import { makeRequest } from "./helpers";

const mockDb = buildMockDb();
const mockGetCurrentUser = vi.fn(async () => ({ user: { id: "admin1", email: "admin@b.com", role: "admin" } }));
const mockIsAdmin = vi.fn(async () => true);
const mockListUsers = vi.fn(async () => [{ id: "u1", email: "a@b.com", full_name: "Ada", role: "user" }]);
const mockCreateUser = vi.fn(async () => ({ ok: true, userId: "new-id" }));
const mockUpdateUser = vi.fn(async () => ({ ok: true }));
const mockDeleteUser = vi.fn(async () => ({ ok: true }));
const mockLogError = vi.fn(async () => true);

vi.mock("@/lib/auth/current-user.server", () => ({ getCurrentUser: mockGetCurrentUser }));
vi.mock("@/lib/auth/admin", () => ({
  isAdmin: mockIsAdmin,
  listUsers: mockListUsers,
  createUser: mockCreateUser,
  updateUser: mockUpdateUser,
  deleteUser: mockDeleteUser,
}));
vi.mock("@/lib/core/error-log", () => ({ logError: mockLogError }));

let GET, POST, PATCH, DELETE;
beforeAll(async () => {
  const mod = await import("@/app/api/admin/users/route");
  GET = mod.GET;
  POST = mod.POST;
  PATCH = mod.PATCH;
  DELETE = mod.DELETE;
});

beforeEach(() => {
  resetMockDb(mockDb);
  mockGetCurrentUser.mockReset();
  mockIsAdmin.mockReset();
  mockListUsers.mockReset();
  mockCreateUser.mockReset();
  mockUpdateUser.mockReset();
  mockDeleteUser.mockReset();
  mockLogError.mockReset();
});

const URL = "http://localhost:3000/api/admin/users";

function asAdmin() {
  mockGetCurrentUser.mockResolvedValue({ user: { id: "admin1", role: "admin" } });
  mockIsAdmin.mockResolvedValue(true);
}
function notAuthenticated() {
  mockGetCurrentUser.mockResolvedValue(null);
}
function notAdmin() {
  mockGetCurrentUser.mockResolvedValue({ user: { id: "user1", role: "user" } });
  mockIsAdmin.mockResolvedValue(false);
}

describe("GET /api/admin/users", () => {
  it("returns 401 when not authenticated", async () => {
    notAuthenticated();
    expect((await GET(makeRequest(URL))).status).toBe(401);
  });
  it("returns 403 when not an admin", async () => {
    notAdmin();
    expect((await GET(makeRequest(URL))).status).toBe(403);
  });
  it("returns 200 with the user list for admins", async () => {
    asAdmin();
    const res = await GET(makeRequest(URL));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(Array.isArray(body.users)).toBe(true);
  });
});

describe("POST /api/admin/users", () => {
  it("returns 401 when not authenticated", async () => {
    notAuthenticated();
    expect((await POST(makeRequest(URL, { method: "POST", body: { email: "x@y.com", password: "pw123456", full_name: "X" } }))).status).toBe(401);
  });
  it("returns 403 when not an admin", async () => {
    notAdmin();
    expect((await POST(makeRequest(URL, { method: "POST", body: { email: "x@y.com", password: "pw123456", full_name: "X" } }))).status).toBe(403);
  });
  it("returns 400 when createUser fails validation", async () => {
    asAdmin();
    mockCreateUser.mockResolvedValue({ ok: false, error: "Missing required fields." });
    const res = await POST(makeRequest(URL, { method: "POST", body: {} }));
    expect(res.status).toBe(400);
  });
  it("returns 201 on successful create", async () => {
    asAdmin();
    const res = await POST(makeRequest(URL, { method: "POST", body: { email: "x@y.com", password: "pw123456", full_name: "X", role: "user" } }));
    expect(res.status).toBe(201);
    expect((await res.json()).userId).toBe("new-id");
  });
});

describe("PATCH /api/admin/users", () => {
  it("returns 401 when not authenticated", async () => {
    notAuthenticated();
    expect((await PATCH(makeRequest(URL, { method: "PATCH", body: { userId: "u1", email: "x@y.com" } }))).status).toBe(401);
  });
  it("returns 403 when not an admin", async () => {
    notAdmin();
    expect((await PATCH(makeRequest(URL, { method: "PATCH", body: { userId: "u1", email: "x@y.com" } }))).status).toBe(403);
  });
  it("returns 400 when userId is missing", async () => {
    asAdmin();
    const res = await PATCH(makeRequest(URL, { method: "PATCH", body: { email: "x@y.com" } }));
    expect(res.status).toBe(400);
  });
  it("returns 400 when updateUser fails", async () => {
    asAdmin();
    mockUpdateUser.mockResolvedValue({ ok: false, error: "Could not update user." });
    const res = await PATCH(makeRequest(URL, { method: "PATCH", body: { userId: "u1", email: "x@y.com" } }));
    expect(res.status).toBe(400);
  });
  it("returns 200 on successful update", async () => {
    asAdmin();
    const res = await PATCH(makeRequest(URL, { method: "PATCH", body: { userId: "u1", email: "x@y.com" } }));
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
  });
});

describe("DELETE /api/admin/users", () => {
  it("returns 401 when not authenticated", async () => {
    notAuthenticated();
    expect((await DELETE(makeRequest(`${URL}?id=u1`, { method: "DELETE" }))).status).toBe(401);
  });
  it("returns 403 when not an admin", async () => {
    notAdmin();
    expect((await DELETE(makeRequest(`${URL}?id=u1`, { method: "DELETE" }))).status).toBe(403);
  });
  it("returns 400 when id is missing", async () => {
    asAdmin();
    const res = await DELETE(makeRequest(URL, { method: "DELETE" }));
    expect(res.status).toBe(400);
  });
  it("returns 400 when deleteUser fails", async () => {
    asAdmin();
    mockDeleteUser.mockResolvedValue({ ok: false, error: "Could not delete user." });
    const res = await DELETE(makeRequest(`${URL}?id=u1`, { method: "DELETE" }));
    expect(res.status).toBe(400);
  });
  it("returns 200 on successful delete", async () => {
    asAdmin();
    const res = await DELETE(makeRequest(`${URL}?id=u1`, { method: "DELETE" }));
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
  });
});
