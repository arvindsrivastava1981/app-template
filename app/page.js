import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = "error";

export const metadata = {
  title: `App Template | Secure Authentication & User Management`,
  description: "Production-ready Next.js template with login, signup, profile management, password reset, and admin dashboard.",
  openGraph: {
    title: "App Template | Secure Authentication & User Management",
    description: "Plug-and-play Next.js app template with auth, admin, and user management.",
    type: "website",
    locale: "en_US",
  },
};

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-zinc-50/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-serif text-sm font-semibold">
                A
              </div>
              <span className="font-serif font-bold text-xl text-zinc-900 dark:text-white tracking-tight">
                App<span className="text-emerald-600">Template</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-serif font-bold text-4xl leading-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl lg:text-6xl">
            Authentication,
            <br />
            <span className="text-emerald-600 dark:text-emerald-400">engineered elegantly.</span>
          </h1>
          <p className="mt-5 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed sm:text-lg">
            A production-ready Next.js template with secure login, signup, profile management, password reset, and an admin dashboard.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-emerald-700 hover:shadow-xl sm:w-auto"
            >
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-8 py-4 text-sm font-semibold text-zinc-900 shadow-sm transition-all hover:-translate-y-1 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 sm:w-auto"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-200 py-10 px-4 sm:px-6 lg:px-8 dark:border-zinc-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 font-serif text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white text-xs">
              A
            </span>
            App Template
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            © {new Date().getFullYear()} App Template. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
