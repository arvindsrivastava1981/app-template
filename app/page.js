import Link from "next/link";
import { ArrowRight, ShieldCheck, Lock, User } from "lucide-react";

export const dynamic = "error";

export const metadata = {
  title: `App Template | Secure Authentication & User Management`,
  description: "Production-ready app template with login, signup, profile management, password reset, and admin dashboard.",
  openGraph: {
    title: "App Template | Secure Authentication & User Management",
    description: "Plug-and-play Next.js app template with auth, admin, user management, profile, and password flows.",
    type: "website",
    locale: "en_US",
  },
};

const FEATURES = [
  {
    icon: Lock,
    title: "Secure Authentication",
    desc: "JWT session management with bcrypt password hashing and httpOnly cookies.",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access Control",
    desc: "Admin and User roles with protected routes and admin-only user management.",
  },
  {
    icon: User,
    title: "Profile & Password",
    desc: "Self-service profile updates and password changes for every user.",
  },
  {
    icon: ArrowRight,
    title: "Plug-and-Play",
    desc: "Copy this template into any Next.js project and start building immediately.",
  },
];

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <section className="flex-shrink-0 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-700 font-serif text-sm font-semibold dark:bg-emerald-950 dark:text-emerald-300">
                A
              </div>
              <span className="text-sm font-serif font-semibold text-zinc-900 dark:text-zinc-100">App Template</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/login" className="text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400">Sign in</Link>
              <Link href="/register" className="text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400">Signup</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-serif font-bold text-zinc-900 dark:text-zinc-100 sm:text-5xl sm:tracking-tight">
            App Template
          </h1>
          <p className="mt-6 text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
            Production-ready authentication and user management template. Login, signup, profile,
            password reset, admin dashboard, and user management — ready to drop into any Next.js app.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/register" className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
              Signup
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
            <Link href="/login" className="rounded-lg border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200 py-20 px-4 sm:px-6 lg:px-8 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-2xl font-serif font-semibold text-zinc-900 dark:text-zinc-100">
            Everything you need in one template
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base text-zinc-500 dark:text-zinc-400">
            Responsive, secure, and extensible. Works on mobile and desktop.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{f.title}</h3>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-200 py-8 px-4 sm:px-6 lg:px-8 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 font-serif">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-600/10 text-emerald-700 text-xs font-semibold dark:bg-emerald-950 dark:text-emerald-300">
              A
            </div>
            <span className="text-xs text-zinc-600 dark:text-zinc-400">App Template</span>
          </div>
          <nav className="flex items-center gap-6 text-xs text-zinc-500 dark:text-zinc-400">
            <Link href="/login" className="hover:text-zinc-900 dark:hover:text-zinc-100">Sign in</Link>
            <Link href="/register" className="hover:text-zinc-900 dark:hover:text-zinc-100">Signup</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}