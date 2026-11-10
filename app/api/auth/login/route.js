import { NextResponse } from "next/server";
import { db } from "@/lib/core/db";
import { verifyPassword } from "@/lib/auth/password";
import { createSessionToken, COOKIE_NAME, SESSION_TTL_SECONDS, normalizeEmail } from "@/lib/auth/session";
import { logError, logStatusError } from "@/lib/core/error-log";

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
    const email = normalizeEmail(String(body.email ?? "").trim());
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    let row;
    try {
      row = await db.user.findUnique({
        where: { email },
        select: { id: true, email: true, password_hash: true, full_name: true },
      });
    } catch (err) {
      await logError({ endpoint: "auth/login", status_code: 500, message: "Login lookup failed", traceback_text: err, source: "BACKEND" });
      return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
    }

    if (!row || !row.password_hash) {
      await logStatusError("auth/login", "Invalid login credentials", { status_code: 401 });
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    const ok = await verifyPassword(password, row.password_hash);
    if (!ok) {
      await logStatusError("auth/login", "Invalid login credentials", { status_code: 401 });
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = await createSessionToken(row.id, SESSION_TTL_SECONDS, row.role ?? "user");
    const response = NextResponse.json({ ok: true, message: "Login successful." }, { status: 200 });
    response.cookies.set(sessionCookie(token, SESSION_TTL_SECONDS));
    return response;
  } catch (err) {
    console.error("[auth] login failed:", err);
    await logError({ endpoint: "auth/login", status_code: 500, message: "Login failed", traceback_text: err, source: "BACKEND" });
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}