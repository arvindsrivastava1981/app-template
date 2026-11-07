import { NextResponse } from "next/server";
import { db } from "@/backend/lib/core/db";
import { verifyPassword } from "@/backend/lib/auth/password";
import { createSessionToken, COOKIE_NAME, SESSION_TTL_SECONDS, normalizeEmail, isPhoneIdentifier, normalizePhone } from "@/backend/lib/auth/session";
import { logError, logStatusError } from "@/backend/lib/core/error-log";

function sessionCookie(token, ttlSeconds) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ttlSeconds,
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const rawIdentifier = String(body.identifier ?? body.email ?? "").trim();
    const email = normalizeEmail(rawIdentifier);
    const isPhone = isPhoneIdentifier(rawIdentifier);
    const phone = isPhone ? normalizePhone(rawIdentifier) : "";
    const password = String(body.password || "");

    if ((!email && !phone) || !password) {
      return NextResponse.json({ error: "Email/phone and password are required." }, { status: 400 });
    }

    const sql = db();
    let rows;
    try {
      rows = isPhone
        ? await sql`
          SELECT id, email, password_hash, full_name, role, is_admin, is_email_verified, failed_login_attempts, locked_until
          FROM users WHERE phone = ${phone} AND auth_provider = 'email' ORDER BY created_at DESC LIMIT 1
        `
        : await sql`
          SELECT id, email, password_hash, full_name, role, is_admin, is_email_verified, failed_login_attempts, locked_until
          FROM users WHERE email = ${email} AND auth_provider = 'email' LIMIT 1
        `;
    } catch (err) {
      // phone column may not exist; fall back to email-only
      if (isPhone) {
        return NextResponse.json({ error: "Phone login is not available yet. Please sign in with email." }, { status: 503 });
      }
      await logError({ endpoint: "auth/login", status_code: 500, message: "Login lookup failed", traceback_text: err, source: "BACKEND" });
      return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
    }

    const row = rows[0];
    if (!row || !row.password_hash) {
      await logStatusError("auth/login", "Invalid login credentials", { status_code: 401 });
      return NextResponse.json({ error: "Invalid email/phone or password." }, { status: 401 });
    }

    const lockedUntil = row.locked_until ? new Date(row.locked_until) : null;
    if (lockedUntil && lockedUntil.getTime() > Date.now()) {
      const mins = Math.max(1, Math.ceil((lockedUntil.getTime() - Date.now()) / 60000));
      return NextResponse.json({ error: `Too many failed attempts. Try again in ${mins} minute${mins === 1 ? "" : "s"}.` }, { status: 429 });
    }

    const ok = await verifyPassword(password, row.password_hash);
    if (!ok) {
      const failed = (Number(row.failed_login_attempts) || 0) + 1;
      const maxAttempts = 5;
      if (failed >= maxAttempts) {
        const lockUntil = new Date(Date.now() + 15 * 60 * 1000);
        await sql`UPDATE users SET failed_login_attempts = 0, locked_until = ${lockUntil.toISOString()} WHERE id = ${row.id}`;
        await logStatusError("auth/login", "Account locked after repeated failures", { status_code: 429 });
        return NextResponse.json({ error: "Too many failed attempts. Your account is locked for 15 minutes." }, { status: 429 });
      }
      await sql`UPDATE users SET failed_login_attempts = ${failed} WHERE id = ${row.id}`;
      await logStatusError("auth/login", "Invalid login credentials", { status_code: 401 });
      return NextResponse.json({ error: "Invalid email/phone or password." }, { status: 401 });
    }

    await sql`UPDATE users SET last_login_at = NOW(), failed_login_attempts = 0, locked_until = NULL WHERE id = ${row.id}`;

    const token = await createSessionToken(row.id, SESSION_TTL_SECONDS);
    const response = NextResponse.json({ ok: true, message: "Login successful.", is_admin: Boolean(row.is_admin || row.role === "admin"), role: row.role || "user" }, { status: 200 });
    response.cookies.set(sessionCookie(token, SESSION_TTL_SECONDS));
    return response;
  } catch (err) {
    console.error("[auth] login failed:", err);
    await logError({ endpoint: "auth/login", status_code: 500, message: "Login failed", traceback_text: err, source: "BACKEND" });
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}