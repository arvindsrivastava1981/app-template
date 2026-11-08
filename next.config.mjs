import { execSync } from "child_process";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

function resolveAppVersion() {
  if (process.env.NEXT_PUBLIC_APP_VERSION) {
    return process.env.NEXT_PUBLIC_APP_VERSION;
  }
  try {
    return execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim();
  } catch {
    return `build-${Date.now()}`;
  }
}

const isProductionBuild = process.env.NODE_ENV === "production";

function normalizeUrl(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

function isLocalhostUrl(value) {
  return /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?$/i.test(
    normalizeUrl(value)
  );
}

function readWranglerAppUrl() {
  try {
    const toml = fs.readFileSync(
      fileURLToPath(new URL("./wrangler.toml", import.meta.url)),
      "utf8"
    );
    let section = "";
    let fallback = "";
    for (const line of toml.split(/\r?\n/)) {
      const header = line.match(/^\s*\[([^\]]+)\]\s*$/);
      if (header) {
        section = header[1].trim();
        continue;
      }
      const entry = line.match(/^\s*NEXT_PUBLIC_APP_URL\s*=\s*["']([^"']+)["']/);
      if (!entry) continue;
      const value = normalizeUrl(entry[1]);
      if (section === "env.production.vars") return value;
      if (!fallback) fallback = value;
    }
    return fallback;
  } catch {
    return "";
  }
}

function resolveAppUrl() {
  const fromEnv = normalizeUrl(process.env.NEXT_PUBLIC_APP_URL);

  if (!isProductionBuild) {
    return fromEnv || "http://localhost:3000";
  }

  if (fromEnv && !isLocalhostUrl(fromEnv)) {
    return fromEnv;
  }

  const fromWrangler = readWranglerAppUrl();
  if (fromWrangler && !isLocalhostUrl(fromWrangler)) {
    console.warn(
      `[next.config] NEXT_PUBLIC_APP_URL="${fromEnv || "(unset)"}" ignored for this production build; ` +
        `using "${fromWrangler}" from wrangler.toml.`
    );
    return fromWrangler;
  }

  console.warn(
    `[next.config] NEXT_PUBLIC_APP_URL is not a public origin for this production build. ` +
      `Absolute URLs (og:url, OAuth redirects) will point at "${fromEnv || "http://localhost:3000"}".`
  );
  return fromEnv || "http://localhost:3000";
}

const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_URL: resolveAppUrl(),
    NEXT_PUBLIC_APP_VERSION: resolveAppVersion(),
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "1mb",
    },
  },
  compress: true,
  generateEtags: true,
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;