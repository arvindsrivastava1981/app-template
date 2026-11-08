import { readSession, getSessionFromClient, verifySessionToken } from "./session";
import { db } from "../core/db";
import { requestCache } from "../core/request-cache";

export { getCurrentUserServer } from "./current-user";

/**
 * Get the current user.
 * @deprecated Use getCurrentUserServer for Server Components or getCurrentUserClient for Client Components.
 * This export exists for backward compatibility but may not work in all contexts.
 */
export async function getCurrentUser() {
  // Try server-side first, fall back to client-side
  try {
    return await getCurrentUserServer();
  } catch {
    return getCurrentUserClient();
  }
}