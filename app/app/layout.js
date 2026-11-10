import { Suspense } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { getCurrentUser } from "@/lib/auth/current-user.server";
import { getSetting } from "@/lib/settings/service";
import { APP_NAME } from "@/lib/public/branding";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }) {
  const ctx = await getCurrentUser();
  if (!ctx || !ctx.user) return null; // middleware redirects unauthenticated users to /login

  const appName = await getSetting("app_name");

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar
        userName={ctx.user.full_name || ctx.user.email}
        appName={String(appName || APP_NAME)}
      />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 md:py-8">
        <Suspense>{children}</Suspense>
      </main>
    </div>
  );
}