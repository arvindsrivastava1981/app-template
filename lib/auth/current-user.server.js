import { readSession } from "./session.server";
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
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true, full_name: true, role: true, created_at: true, updated_at: true },
    });
    if (!user) return INVALID_USER;
    return { user };
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
    return INVALID_USER;
  }
}
