import { NextResponse } from "next/server";
import { db } from "@/lib/core/db";
import { sendEmail } from "@/lib/core/email";
import { logError } from "@/lib/core/error-log";
import { normalizeEmail } from "@/lib/auth/session";
import { appBaseUrl } from "@/lib/core/app-url";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body.email);

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const token = crypto.randomUUID().replace(/-/g, "");
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    try {
      await db.user.updateMany({
        where: { email },
        data: { reset_token: token, reset_token_expires_at: expires },
      });
      const baseUrl = appBaseUrl(request);
      const link = `${baseUrl}/reset-password?token=${token}`;
      await sendEmail({
        to: email,
        subject: "Reset your password",
        html: `<p>Click to reset your password:</p><p><a href="${link}">${link}</a></p><p>This link expires in 1 hour.</p>`,
      });
    } catch (err) {
      console.error("[auth] requestReset failed:", err);
      await logError({ endpoint: "auth/request-reset", status_code: 500, message: "Password reset request failed", detail: { email }, traceback_text: err, source: "BACKEND" });
    }

    return NextResponse.json({ ok: true, message: "If that email is registered, a reset link has been sent." }, { status: 200 });
  } catch (err) {
    console.error("[auth] forgot-password failed:", err);
    await logError({ endpoint: "auth/forgot-password", status_code: 500, message: "Forgot password request failed", traceback_text: err, source: "BACKEND" });
    return NextResponse.json({ error: "Request failed. Please try again." }, { status: 500 });
  }
}