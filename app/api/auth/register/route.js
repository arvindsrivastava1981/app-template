import { NextResponse } from "next/server";
import { db } from "@/lib/core/db";
import { hashPassword } from "@/lib/auth/password";
import { createSessionToken, COOKIE_NAME, SESSION_TTL_SECONDS, normalizeEmail } from "@/lib/auth/session";
import { logError } from "@/lib/core/error-log";
import { appBaseUrl } from "@/lib/core/app-url";
import { sendEmail } from "@/lib/core/email";

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
    const email = normalizeEmail(body.email);
    const password = String(body.password || "");
    const fullName = String(body.full_name || "").trim();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }
    if (!fullName) {
      return NextResponse.json({ error: "Enter your full name." }, { status: 400 });
    }

    const existing = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const userId = crypto.randomUUID();
    const verificationToken = crypto.randomUUID().replace(/-/g, "");
    const verificationExpires = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

    try {
      await db.user.create({
        data: {
          id: userId,
          email,
          password_hash: passwordHash,
          full_name: fullName,
          verification_token: verificationToken,
          verification_token_expires_at: verificationExpires,
        },
      });
    } catch (err) {
      console.error("[auth] register tx failed:", err);
      await logError({ endpoint: "auth/register", status_code: 500, message: "Registration failed", detail: { email }, traceback_text: err, source: "BACKEND" });
      return NextResponse.json({ error: "Could not create your account. Please try again." }, { status: 500 });
    }

    try {
      const baseUrl = appBaseUrl(request);
      const link = `${baseUrl}/verify-email?token=${verificationToken}`;
      await sendEmail({
        to: email,
        subject: "Verify your email",
        html: `<p>Please verify your email address:</p><p><a href="${link}">${link}</a></p><p>This link expires in 48 hours.</p>`,
      });
    } catch (err) {
      console.error("[auth] verification email failed:", err);
    }

    const ttlSeconds = SESSION_TTL_SECONDS;
    const token = await createSessionToken(userId, ttlSeconds);
    const response = NextResponse.json({ ok: true, message: "Account created successfully." }, { status: 201 });
    response.cookies.set(sessionCookie(token, ttlSeconds));
    return response;
  } catch (err) {
    console.error("[auth] register failed:", err);
    await logError({ endpoint: "auth/register", status_code: 500, message: "Registration failed", traceback_text: err, source: "BACKEND" });
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}