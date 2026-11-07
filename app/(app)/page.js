import Link from "next/link";
import { LayoutDashboard, Wallet, ShieldCheck, User } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        icon={LayoutDashboard}
        title="Dashboard"
        subtitle="Welcome back to your account"
      />

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <div className="p-4">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Your Role</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">User</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Status</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-600 dark:text-emerald-400">Active</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Sessions</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">1</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Plan</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Free</p>
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Update Profile</h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Manage your personal information and account settings.</p>
              </div>
            </div>
            <Link href="/app/settings" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300">
              Go to settings <span className="h-4 w-4">→</span>
            </Link>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Change Password</h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Update your account password anytime.</p>
              </div>
            </div>
            <Link href="/app/settings" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300">
              Change password <span className="h-4 w-4">→</span>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}