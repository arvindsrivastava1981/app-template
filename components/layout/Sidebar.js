"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Settings, LogOut, Menu, X, ShieldCheck } from "lucide-react";

const NAV = [
  { label: "Overview", items: [{ href: "/app", label: "Dashboard", icon: LayoutDashboard }] },
  { label: "Account", items: [{ href: "/app/settings", label: "Settings", icon: Settings }] },
];

function initialsOf(name) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.charAt(0) || "U";
  const second = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return (first + second).toUpperCase();
}

export default function Sidebar({ userName, appName = "App" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href, exact = false) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  async function handleLogout(e) {
    e.preventDefault();
    setOpen(false);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      if (response.ok) {
        window.location.assign("/");
      } else {
        window.location.assign("/login");
      }
    } catch (err) {
      window.location.assign("/login");
    }
  }

  const activeClass = (active) =>
    active ? "bg-emerald-600 font-medium text-white shadow-sm" : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800";

  const renderGroups = () => (
    <>
      {NAV.map((group) => (
        <div key={group.label}>
          <div className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{group.label}</div>
          {group.items.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-colors ${activeClass(isActive(item.href, item.exact))}`}>
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${isActive(item.href, item.exact) ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                <item.icon className="h-4 w-4" strokeWidth={1.75} />
              </span>
              {item.label}
              {isActive(item.href, item.exact) && <span className="ml-auto h-4 w-4 opacity-50">›</span>}
            </Link>
          ))}
        </div>
      ))}
    </>
  );

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center gap-2 px-4 py-3 bg-white/50 backdrop-blur border-b border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800">
        <Link href="/app" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-serif font-semibold text-zinc-900 dark:text-zinc-100">{appName}</div>
          </div>
        </Link>
        <button type="button" onClick={() => setOpen(!open)} className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="fixed inset-y-0 left-0 flex w-72 flex-col bg-white dark:bg-zinc-900">
            <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
              <div className="flex items-center gap-2 rounded-lg bg-zinc-50 px-2.5 py-1.5 dark:bg-zinc-800">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">{initialsOf(userName)}</span>
                <span className="flex-1 truncate text-sm font-medium text-zinc-700 dark:text-zinc-300">{userName || "User"}</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-3">{renderGroups()}</div>
            <div className="border-t border-zinc-200 dark:border-zinc-800">
              <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </aside>
        </div>
      )}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-zinc-200 bg-white md:flex dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex items-center gap-2 rounded-lg bg-zinc-50 px-2.5 py-1.5 dark:bg-zinc-800">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">{initialsOf(userName)}</span>
            <span className="flex-1 truncate text-sm font-medium text-zinc-700 dark:text-zinc-300">{userName || "User"}</span>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-3">{renderGroups()}</nav>
        <div className="border-t border-zinc-200 dark:border-zinc-800">
          <button onClick={handleLogout} className="mx-1.5 mb-1.5 flex w-[calc(100%-0.75rem)] items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}