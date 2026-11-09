import Link from "next/link";
import { LayoutDashboard, Users } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { db } from "@/lib/core/db";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const totalUsers = await db.user.count();
    return { totalUsers };
  } catch {
    return { totalUsers: 0 };
  }
}

export default async function AdminDashboard() {
  const { totalUsers } = await getStats();

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader icon={LayoutDashboard} title="Admin Dashboard" subtitle="Manage users" />

      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Total users</p>
            <p className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">{totalUsers}</p>
          </div>
        </div>

        <Link
          href="/admin/users"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700"
        >
          <Users className="h-4 w-4" />
          User Management
        </Link>
      </section>
    </div>
  );
}
