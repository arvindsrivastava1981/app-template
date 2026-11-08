import Link from "next/link";
import Card from "@/components/ui/Card";
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

const STEPS = [
  {
    number: "01",
    title: "Clone the template",
    desc: "Drop the Next.js app into your repository and install dependencies.",
  },
  {
    number: "02",
    title: "Connect your database",
    desc: "Set your DATABASE_URL and run the schema migrations.",
  },
  {
    number: "03",
    title: "Deploy and go live",
    desc: "Deploy to Cloudflare Workers or any Next.js-compatible platform.",
  },
];

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
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link
                href="/login"
                className="text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
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

      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[560px] bg-emerald-50/40 dark:bg-emerald-900/10 blur-[120px] rounded-full opacity-60 dark:opacity-30"></div>
        </div>
        <div className="mx-auto max-w-5xl">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-300 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Production ready
            </div>
            <h1 className="text-5xl font-serif font-bold text-zinc-900 dark:text-zinc-100 tracking-tight sm:text-6xl lg:text-7xl leading-[1.1]">
              Authentication,<br className="hidden md:block" />
              <span className="text-emerald-600 dark:text-emerald-400">engineered elegantly.</span>
            </h1>
            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-xl lg:max-w-none leading-relaxed">
              A production-ready Next.js template with login, signup, profile management, password reset, admin dashboard, and user management — secure by design and ready to deploy.
            </p>
            <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4">
              <Link
                href="/register"
                className="rounded-xl bg-emerald-600 px-8 py-4 text-sm font-semibold text-white shadow-lg hover:bg-emerald-700 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                Start building <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
              <Link
                href="/login"
                className="rounded-xl border border-zinc-200 bg-white px-8 py-4 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 transition-all hover:-translate-y-1 hover:shadow-md"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="mt-16 relative">
            <div className="mx-auto max-w-xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/90"></div>
                <div className="h-3 w-3 rounded-full bg-amber-500/90"></div>
                <div className="h-3 w-3 rounded-full bg-emerald-500/90"></div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-zinc-500">
                <div className="h-8 w-24 rounded-md bg-zinc-100 dark:bg-zinc-800"></div>
                <div className="h-8 w-48 rounded-md bg-zinc-100 dark:bg-zinc-800"></div>
              </div>
              <div className="mt-4 h-24 w-full rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-600"></div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-zinc-400" />
                  <span className="text-sm text-zinc-500">2,847 users</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-zinc-400" />
                  <span className="text-sm text-zinc-500">SOC-ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 border-y border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-100 sm:text-4xl tracking-tight">
              Built for modern teams
            </h2>
            <p className="mt-4 text-base text-zinc-500 dark:text-zinc-400">
              Everything you need to ship secure authentication in minutes, not weeks.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <Card key={f.title} interactive variant="default" className="p-6 flex flex-col h-full">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 mb-4">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-serif font-semibold text-zinc-900 dark:text-zinc-100">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {f.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.title} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-zinc-900 text-white font-mono text-sm font-bold dark:bg-white dark:text-zinc-900 dark:border-zinc-800">
                    {step.number}
                  </span>
                  <h3 className="text-lg font-serif font-semibold text-zinc-900 dark:text-zinc-100">
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-900 p-8 sm:p-12 text-center dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-3xl font-serif font-bold text-white sm:text-4xl">Ready to launch?</h2>
            <p className="mt-4 text-base text-zinc-300 max-w-xl mx-auto">
              Join teams shipping secure, production-ready apps today.
            </p>
            <div className="mt-10">
              <Link
                href="/register"
                className="rounded-xl bg-emerald-600 px-8 py-4 text-sm font-semibold text-white shadow-lg hover:bg-emerald-700 transition hover:-translate-y-1"
              >
                Get started free
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-200 py-12 px-4 sm:px-6 lg:px-8 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 font-serif">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white text-xs font-semibold">
              A
            </div>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">App Template</span>
          </div>
          <nav className="flex items-center gap-6 text-xs text-zinc-500 dark:text-zinc-400">
            <Link href="/login" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Sign in
            </Link>
            <Link href="/register" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Sign up
            </Link>
          </nav>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            © {new Date().getFullYear()} App Template. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}