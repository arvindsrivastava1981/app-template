import Link from "next/link";
import { LayoutDashboard, User, ShieldCheck } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        icon={LayoutDashboard}
        title="Dashboard"
        subtitle="Welcome back to your account"
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <div className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Role</p>
                <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">User</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Status</p>
                <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">Active</p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <Card>
        <div className="p-5 sm:p-6">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Manage your account</h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Update your profile or change your password from here.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/app/settings"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <User className="h-4 w-4" />
              Settings
            </Link>
            <Link
              href="/app/settings"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              <ShieldCheck className="h-4 w-4" />
              Change password
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}