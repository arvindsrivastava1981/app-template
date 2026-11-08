import { NextResponse } from "next/server";
import { db } from "@/lib/core/db";
import { hashPassword } from "@/lib/auth/password";
import { logError, logStatusError } from "@/lib/core/error-log";

export async function POST(request) {
  try {
    const body = await request.json();
    const token = String(body.token || "");
    const password = String(body.password || "");

    if (password.length < 8) {
      await logStatusError("auth/confirm-reset", "New password too short", { status_code: 422 });
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    try {
      const row = await db.user.findFirst({
        where: {
          reset_token: token,
          reset_token_expires_at: { gt: new Date() },
        },
        select: { id: true },
      });
      if (!row) {
        await logStatusError("auth/confirm-reset", "Invalid or expired reset token", { status_code: 400 });
        return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });
      }

      const passwordHash = await hashPassword(password);
      await db.user.update({
        where: { id: row.id },
        data: { password_hash: passwordHash, reset_token: null, reset_token_expires_at: null },
      });
      return NextResponse.json({ ok: true, message: "Password updated. You can now log in." }, { status: 200 });
    } catch (err) {
      console.error("[auth] confirmReset failed:", err);
      await logError({ endpoint: "auth/confirm-reset", status_code: 500, message: "Password reset confirmation failed", traceback_text: err, source: "BACKEND" });
      return NextResponse.json({ error: "Could not reset your password. Please try again." }, { status: 500 });
    }
  } catch (err) {
    console.error("[auth] reset-password failed:", err);
    await logError({ endpoint: "auth/reset-password", status_code: 500, message: "Reset password request failed", traceback_text: err, source: "BACKEND" });
    return NextResponse.json({ error: "Request failed. Please try again." }, { status: 500 });
  }
}