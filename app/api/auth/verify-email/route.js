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

    const sql = db();
    const rows = await sql`
      SELECT id FROM users
      WHERE verification_token = ${token} AND verification_token_expires_at > NOW() LIMIT 1
    `;
    const row = rows[0];
    if (!row) {
      await logStatusError("auth/verify-email", "Invalid or expired verification token", { status_code: 400 });
      return NextResponse.json({ error: "This verification link is invalid or has expired." }, { status: 400 });
    }

    await sql`
      UPDATE users SET verification_token = NULL, verification_token_expires_at = NULL
      WHERE id = ${row.id}
    `;

    return NextResponse.redirect(new URL("/login?verified=1", request.url));
  } catch (err) {
    console.error("[auth] verify-email failed:", err);
    await logError({ endpoint: "auth/verify-email", status_code: 500, message: "Email verification failed", traceback_text: err, source: "BACKEND" });
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 });
  }
}