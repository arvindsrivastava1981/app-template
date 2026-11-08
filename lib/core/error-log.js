import { db } from "./db";
import { headers } from "next/headers";

export const ERROR_TYPES = ["API_ERROR", "VALIDATION", "HTTP", "INTERNAL"];
export const SOURCES = ["BACKEND", "TEST"];

export function typeForStatus(statusCode) {
  const code = Number(statusCode) || 500;
  if (code >= 500) return "INTERNAL";
  if (code === 422 || code === 400) return "VALIDATION";
  if (code >= 400 && code < 500) return "HTTP";
  return "API_ERROR";
}

export function stackFrom(err) {
  if (err == null) return "";
  try {
    if (err.stack) return String(err.stack);
    if (err.message) return String(err.message);
  } catch {}
  try {
    return String(err);
  } catch {
    return "";
  }
}

export function safeDetail(detail) {
  if (detail == null) return null;
  try {
    if (typeof detail === "string") return detail;
    return JSON.stringify(detail);
  } catch {
    return String(detail);
  }
}

async function currentRequestContext() {
  let method = "GET";
  let path = "/";
  let request_id = null;
  try {
    const h = await headers();
    method = h.get("x-forwarded-method") || h.get("x-method") || "GET";
    path = h.get("x-forwarded-uri") || h.get("x-path") || "/";
    request_id = h.get("x-request-id") || null;
  } catch {}
  return { method, path, request_id };
}

// Writes to the `error_logs` table. Access is admin-only and is enforced by the
// API route handlers (no RLS policies exist on this table).
export async function logError({
  method,
  path,
  status_code = 500,
  error_type,
  message,
  detail,
  traceback_text,
  endpoint,
  request_id,
  source = "BACKEND",
  error,
} = {}) {
  try {
    const code = Number(status_code) || 500;
    const ctx = await currentRequestContext();
    const msg = String(message || (error && error.message) || "Unknown error");
    const tb = traceback_text || (error ? stackFrom(error) : null);
    const rid = String(request_id || ctx.request_id || "").slice(0, 32) || null;
    const type = ERROR_TYPES.includes(error_type) ? error_type : typeForStatus(code);
    const src = SOURCES.includes(source) ? source : "BACKEND";
    const ep = String(endpoint || path || ctx.path || "/").slice(0, 255);

    await db.errorLog.create({
      data: {
        method: String(method || ctx.method || "GET").slice(0, 10),
        path: String(path || ctx.path || "/"),
        status_code: code,
        error_type: type,
        message: msg,
        detail: safeDetail(detail),
        traceback_text: tb,
        endpoint: ep,
        request_id: rid,
        source: src,
      },
    });
    return true;
  } catch (logErr) {
    console.error("[error-log] failed to record error:", logErr);
    return false;
  }
}

export async function logStatusError(endpoint, message, { status_code = 400, detail, source } = {}) {
  return logError({ endpoint, status_code, message, detail, source, error_type: typeForStatus(status_code) });
}