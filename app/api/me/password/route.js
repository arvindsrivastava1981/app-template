import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { verifyPassword } from "@/lib/auth/password";
import { hashPassword } from "@/lib/auth/password";
import { logError } from "@/lib/core/error-log";
import { db } from "@/lib/core/db";

export async function PATCH(request) {
  try {
    const ctx = await getCurrentUser();
    if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { current_password, new_password } = body;

    if (!current_password || !new_password) {
      return NextResponse.json({ error: "Current password and new password are required." }, { status: 400 });
    }

    if (new_password.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
    }

    const sql = db();
    const rows = await sql`SELECT password_hash FROM users WHERE id = ${ctx.user.id} LIMIT 1`;
    const row = rows[0];
    if (!row) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const ok = await verifyPassword(current_password, row.password_hash);
    if (!ok) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }

    const passwordHash = await hashPassword(new_password);
    await sql`
      UPDATE users
      SET password_hash = ${passwordHash}, updated_at = NOW()
      WHERE id = ${ctx.user.id}
    `;

    return NextResponse.json({ ok: true, message: "Password updated successfully." }, { status: 200 });
  } catch (err) {
    console.error("[me] password change failed:", err);
    await logError({ endpoint: "me/password", status_code: 500, message: "Password change failed", traceback_text: err, source: "BACKEND" });
    return NextResponse.json({ error: "Failed to change password." }, { status: 500 });
  }
}