import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { isAdmin, listUsers, createUser, updateUser, deleteUser } from "@/lib/auth/admin";
import { logError } from "@/lib/core/error-log";

export async function GET(request) {
  try {
    const ctx = await getCurrentUser();
    if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!(await isAdmin(ctx.user.id))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const users = await listUsers();
    return NextResponse.json({ ok: true, users }, { status: 200 });
  } catch (err) {
    console.error("[admin] list users failed:", err);
    await logError({ endpoint: "admin/users", status_code: 500, message: "List users failed", traceback_text: err, source: "BACKEND" });
    return NextResponse.json({ error: "Failed to load users." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const ctx = await getCurrentUser();
    if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!(await isAdmin(ctx.user.id))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const result = await createUser({
      email: body.email,
      password: body.password,
      fullName: body.full_name,
      role: body.role || "user",
    });

    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true, userId: result.userId }, { status: 201 });
  } catch (err) {
    console.error("[admin] create user failed:", err);
    await logError({ endpoint: "admin/users", status_code: 500, message: "Create user failed", traceback_text: err, source: "BACKEND" });
    return NextResponse.json({ error: "Failed to create user." }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const ctx = await getCurrentUser();
    if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!(await isAdmin(ctx.user.id))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { userId, ...updates } = body;
    if (!userId) return NextResponse.json({ error: "Missing user ID." }, { status: 400 });

    const result = await updateUser(userId, updates);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[admin] update user failed:", err);
    await logError({ endpoint: "admin/users", status_code: 500, message: "Update user failed", traceback_text: err, source: "BACKEND" });
    return NextResponse.json({ error: "Failed to update user." }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const ctx = await getCurrentUser();
    if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!(await isAdmin(ctx.user.id))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");
    if (!userId) return NextResponse.json({ error: "Missing user ID." }, { status: 400 });

    const result = await deleteUser(userId);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[admin] delete user failed:", err);
    await logError({ endpoint: "admin/users", status_code: 500, message: "Delete user failed", traceback_text: err, source: "BACKEND" });
    return NextResponse.json({ error: "Failed to delete user." }, { status: 500 });
  }
}