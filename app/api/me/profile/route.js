import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user.server";
import { logError } from "@/lib/core/error-log";
import { db } from "@/lib/core/db";

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
    const existing = await db.user.findFirst({
      where: { email, id: { not: ctx.user.id } },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    }

    await db.user.update({
      where: { id: ctx.user.id },
      data: { full_name, email },
    });

    return NextResponse.json({ ok: true, message: "Profile updated successfully." }, { status: 200 });
  } catch (err) {
    console.error("[me] profile update failed:", err);
    await logError({ endpoint: "me/profile", status_code: 500, message: "Profile update failed", traceback_text: err, source: "BACKEND" });
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}