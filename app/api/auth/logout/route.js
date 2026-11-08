import { NextResponse } from "next/server";
import { logError } from "@/lib/core/error-log";

const COOKIE_NAMES = ["app_session"];

export async function POST(request) {
  try {
    const response = NextResponse.json({ ok: true, message: "Logged out successfully." }, { status: 200 });
    for (const name of COOKIE_NAMES) {
      response.cookies.set(name, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
    }
    return response;
  } catch (err) {
    console.error("[auth] logout failed:", err);
    await logError({ endpoint: "auth/logout", status_code: 500, message: "Logout failed", traceback_text: err, source: "BACKEND" });
    return NextResponse.json({ error: "Logout failed." }, { status: 500 });
  }
}