import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user.server";
import { isAdmin } from "@/lib/auth/admin";
import { db } from "@/lib/core/db";

async function requireAdmin() {
  const ctx = await getCurrentUser();
  if (!ctx) return { authorized: false, user: null };
  if (!(await isAdmin(ctx.user.id))) return { authorized: false, user: null };
  return { authorized: true, user: ctx.user };
}

export async function GET(request) {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const params = request.url.split("?")[1];
    const searchParams = new URLSearchParams(params || "");
    const limit = Math.min(Number(searchParams.get("limit")) || 100, 500);
    const offset = Number(searchParams.get("offset")) || 0;

    const [errorLogs, total] = await Promise.all([
      db.errorLog.findMany({
        where: searchParams.get("type") ? { error_type: searchParams.get("type") } : undefined,
        orderBy: { created_at: "desc" },
        take: limit,
        skip: offset,
        select: {
          id: true,
          method: true,
          path: true,
          status_code: true,
          error_type: true,
          message: true,
          endpoint: true,
          source: true,
          created_at: true,
        },
      }),
      db.errorLog.count(),
    ]);

    return NextResponse.json({
      ok: true,
      error_logs: errorLogs,
      total,
      limit,
      offset,
    });
  } catch (err) {
    console.error("[admin/error-logs] failed to fetch:", err);
    return NextResponse.json(
      { error: "Failed to fetch error logs." },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await db.errorLog.deleteMany({});
    return NextResponse.json({ ok: true, message: "Error logs cleared successfully." });
  } catch (err) {
    console.error("[admin/error-logs] failed to clear:", err);
    return NextResponse.json(
      { error: "Failed to clear error logs." },
      { status: 500 }
    );
  }
}

// New endpoint: Group error logs by count per error type
export async function GET_TYPES_COUNT(request) {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const errorTypes = await db.errorLog.groupBy({
      by: ["error_type"],
      _count: {
        error_type: true,
      },
      orderBy: {
        _count: {
          error_type: "desc",
        },
      },
    });

    const total = await db.errorLog.count();

    return NextResponse.json({
      ok: true,
      error_type_counts: errorTypes.map((e) => ({
        error_type: e.error_type,
        count: e._count.error_type,
      })),
      total,
    });
  } catch (err) {
    console.error("[admin/error-logs] failed to fetch type counts:", err);
    return NextResponse.json(
      { error: "Failed to fetch error log counts." },
      { status: 500 }
    );
  }
}
