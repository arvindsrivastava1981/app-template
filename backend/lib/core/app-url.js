export function appBaseUrl(request) {
  const h = request?.headers;
  if (h && typeof h.get === "function") {
    const origin = h.get("origin");
    if (origin && /^https?:\/\//i.test(origin)) return origin.replace(/\/+$/, "");
    const host = h.get("x-forwarded-host") || h.get("host");
    if (host) {
      const proto = h.get("x-forwarded-proto")?.split(",")[0] || "https";
      return `${proto}://${host}`;
    }
  }
  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, "");
}