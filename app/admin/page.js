import Link from "next/link";
import { LayoutDashboard, Users } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import { db } from "@/lib/core/db";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const [userRows] = await Promise.all([
      db()`SELECT COUNT(*)::int AS count FROM users`,
    ]);
    return { totalUsers: userRows[0]?.count ?? 0 };
  } catch {
    return { totalUsers: 0 };
  }
}

export default async function AdminDashboard() {
  const { totalUsers } = await getStats();

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        icon={LayoutDashboard}
        title="Admin Dashboard"
        subtitle="Manage users"
      />

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <div className="p-4">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Users</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{totalUsers}</p>
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/users" className="group">
          <Card interactive className="h-full p-5">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Users className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <h3 className="mt-3 font-medium text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-100 dark:group-hover:text-emerald-400">User Management</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Create, list, and manage all users.</p>
          </Card>
        </Link>
      </section>
    </div>
  );
}