import Link from "next/link";
import { ShieldCheck, Loader2, ArrowRight, Mail, Lock, User, Sparkles } from "lucide-react";
import { APP_NAME } from "@/lib/public/branding";

export default function AuthShell({ children, title, subtitle, showPrivacy = false }) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-zinc-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-100/30 blur-3xl dark:bg-emerald-900/10" />
        <div className="h-64 w-64 translate-x-1/3 translate-y-1/4 rounded-full bg-emerald-100/20 blur-3xl dark:bg-emerald-900/10" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <nav className="mb-8 flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2.5 font-semibold">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700 font-serif text-lg font-semibold dark:bg-emerald-950 dark:text-emerald-300">
              A
            </span>
            <span className="text-zinc-900 dark:text-zinc-100">{APP_NAME}</span>
          </Link>
        </nav>

        {title && (
          <div className="mb-6 text-center">
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>}
          </div>
        )}

        {showPrivacy && (
          <div className="mb-6 flex items-start gap-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
            <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
            <span>Your data stays private. Secure authentication with JWT sessions and bcrypt password hashing.</span>
          </div>
        )}

        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900">
          {children}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
          <Link href="/login" className="hover:text-emerald-700 dark:hover:text-emerald-400">Sign in</Link>
          <span className="mx-2">·</span>
          <Link href="/register" className="hover:text-emerald-700 dark:hover:text-emerald-400">Signup</Link>
        </div>
      </div>
    </main>
  );
}