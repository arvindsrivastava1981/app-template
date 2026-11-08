import { cookies } from "next/headers";

import { verifySessionToken, COOKIE_NAME } from "./session";

/**
 * Read the session from cookies.
 * MUST be called in Server Components or route handlers (not Client Components)
 * because it uses next/headers.cookies()
 */
export async function readSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}
