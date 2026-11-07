import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { logError } from "@/lib/core/error-log";

export async function PATCH(request) {
  try {
    const ctx = await getCurrentUser();
    if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { full_name, email } = body;

    if (!full_name || !email) {
      return NextResponse.json({ error: "Full name and email are required." }, { status: 400 });
    }

    // Update user via direct DB access (simpler than going through admin.js which checks isAdmin)
    const { db } = await import("@/lib/core/db");
    const sql = db();

    const existing = await sql`SELECT id FROM users WHERE email = ${email} AND id != ${ctx.user.id} LIMIT 1`;
    if (existing.length) {
      return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    }

    await sql`
      UPDATE users
      SET full_name = ${full_name}, email = ${email}, updated_at = NOW()
      WHERE id = ${ctx.user.id}
    `;

    return NextResponse.json({ ok: true, message: "Profile updated successfully." }, { status: 200 });
  } catch (err) {
    console.error("[me] profile update failed:", err);
    await logError({ endpoint: "me/profile", status_code: 500, message: "Profile update failed", traceback_text: err, source: "BACKEND" });
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}