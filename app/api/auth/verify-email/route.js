import { NextResponse } from "next/server";
import { db } from "@/lib/core/db";
import { logError, logStatusError } from "@/lib/core/error-log";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Missing verification token." }, { status: 400 });
    }

    const row = await db.user.findFirst({
      where: {
        verification_token: token,
        verification_token_expires_at: { gt: new Date() },
      },
      select: { id: true },
    });
    if (!row) {
      await logStatusError("auth/verify-email", "Invalid or expired verification token", { status_code: 400 });
      return NextResponse.json({ error: "This verification link is invalid or has expired." }, { status: 400 });
    }

    await db.user.update({
      where: { id: row.id },
      data: { verification_token: null, verification_token_expires_at: null },
    });

    return NextResponse.redirect(new URL("/login?verified=1", request.url));
  } catch (err) {
    console.error("[auth] verify-email failed:", err);
    await logError({ endpoint: "auth/verify-email", status_code: 500, message: "Email verification failed", traceback_text: err, source: "BACKEND" });
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 });
  }
}