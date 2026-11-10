import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, COOKIE_NAME } from "@/lib/auth/session";

const AUTH_ROUTES = ["/login", "/register"];
const APP_ROUTES = ["/app"];
const ADMIN_ROUTES = ["/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;
  const isAuthenticated = !!session;
  const role = session?.role ?? "user";
  const isAdmin = role === "admin";

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));
  const isAppRoute = APP_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));
  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));

  // Authenticated users accessing auth pages → redirect to /app
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  // Unauthenticated users accessing protected routes → redirect to /login
  if (!isAuthenticated && (isAppRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Admin users accessing /app → redirect to /admin
  if (isAuthenticated && isAdmin && isAppRoute) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Non-admin users accessing /admin → redirect to /app
  if (isAuthenticated && !isAdmin && isAdminRoute) {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/admin/:path*", "/login", "/register"],
};