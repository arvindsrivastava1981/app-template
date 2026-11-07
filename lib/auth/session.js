import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

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

export async function readSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

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