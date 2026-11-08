import { SignJWT, jwtVerify } from "jose";

/**
 * Get the session token from cookies.
 * This function must be called on the server (e.g., in Server Components, route handlers, or middleware).
 * In Client Components, use getSession() instead which retrieves the token from the cookie store.
 */
export function getCookieStore() {
  // In a real implementation, this would use next/headers.cookies()
  // But we need a client-compatible approach.
  // For now, throw an error if called in client context.
  // The actual cookie access will be handled by the caller's context.
  try {
    // This will be replaced based on the execution context
    return {
      get: () => ({ value: undefined }),
      getAll: () => [],
    };
  } catch {
    return {
      get: () => ({ value: undefined }),
      getAll: () => [],
    };
  }
}

export const COOKIE_NAME = "app_session";

export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

export function normalizeEmail(e) {
  return String(e || "").trim().toLowerCase();
}

export function secretKey() {
  return new TextEncoder().encode(
    process.env.JWT_SECRET || "app-template-insecure-dev-secret"
  );
}

export function resolveTtlSeconds(ttlSeconds) {
  const n = Number(ttlSeconds);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : SESSION_TTL_SECONDS;
}

export async function createSessionToken(userId, ttlSeconds = SESSION_TTL_SECONDS) {
  return await new SignJWT({ sub: userId, role: "user" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${resolveTtlSeconds(ttlSeconds)}s`)
    .sign(secretKey());
}

export async function createAdminSessionToken(userId, ttlSeconds = SESSION_TTL_SECONDS) {
  return await new SignJWT({ sub: userId, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${resolveTtlSeconds(ttlSeconds)}s`)
    .sign(secretKey());
}

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

/**
 * Verify a session token.
 * Can be called from both Server and Client contexts.
 * @param token - The JWT token to verify
 */
export async function verifySessionToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return {
      userId: payload.sub,
      role: payload.role || "user",
    };
  } catch {
    return null;
  }
}

/**
 * Get session for use in Client Components.
 * Retrieves the session token from a data attribute set by the server.
 * This is a client-compatible alternative to readSession().
 */
export async function getSessionFromClient() {
  // In a Client Component, we can't use next/headers.cookies()
  // Instead, the session token should be available via a data attribute
  // set on the document/body by the server, or passed via props
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  if (!token) return null;
  const value = token.split("=")[1];
  return verifySessionToken(value);
}