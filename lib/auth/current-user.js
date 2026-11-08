import { getSessionFromClient } from "./session";

const INVALID_USER = { user: null }; // @deprecated

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
