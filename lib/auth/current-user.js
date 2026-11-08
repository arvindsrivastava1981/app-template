import { readSession, getSessionFromClient, verifySessionToken } from "./session";
import { db } from "../core/db";
import { requestCache } from "../core/request-cache";

const INVALID_USER = { user: null }; // @deprecated

/**
 * Get the current user from the server context.
 * Must be called in Server Components, route handlers, or middleware.
 * Reads the session token from cookies via next/headers.cookies().
 */
export async function getCurrentUserServer() {
  try {
    const session = await readSession();
    if (!session) return INVALID_USER;
    const [user] = await db() 
      `SELECT id, email, full_name, role, is_admin, created_at, updated_at FROM users WHERE id = ${session.userId} LIMIT 1`;
    if (!user) return INVALID_USER;
    return { user };
  } catch {
    return INVALID_USER;
  }
}

/**
 * Get the current user from the client context.
 * Must be called in Client Components.
 * Retrieves the session token from document.cookie, then calls /api/me/profile to fetch the current user data.
 */
export async function getCurrentUserClient() {
  try {
    const session = await getSessionFromClient();
    if (!session || !session.userId) return INVALID_USER;
    const res = await fetch("/api/me/profile", { headers: { "Content-Type": "application/json" } });
    if (!res.ok) return INVALID_USER;
    const data = await res.json();
    if (data.error || !data.user) return INVALID_USER;
    return { user: data.user };
  } catch {
    return INVALID_USER;
  }
}

/**
 * Use getCurrentUserServer for Server Components or getCurrentUserClient for Client Components.
 */
export async function getCurrentUser() {
  try {
    return await getCurrentUserServer();
  } catch {
    return getCurrentUserClient();
  }
}
