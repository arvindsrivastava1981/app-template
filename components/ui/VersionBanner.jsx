"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

const STORAGE_KEY = "app-template:version";

export default function VersionBanner() {
  const currentVersion = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0";
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const previous = localStorage.getItem(STORAGE_KEY);
      // Show banner only when a newly deployed version differs from the stored one.
      if (previous && previous !== currentVersion) {
        setShow(true);
      }
      localStorage.setItem(STORAGE_KEY, currentVersion);
    } catch {
      // localStorage unavailable (e.g. private mode); silently skip.
    }
  }, [currentVersion]);

  const handleReload = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    // Unregister any service workers so stale cached assets don't survive the reload.
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((r) => r.unregister());
      });
    }
    window.location.reload();
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[70] border-b border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-900/40 dark:text-emerald-100 px-4 py-2 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <AlertCircle className="h-4 w-4" />
          New version available ({currentVersion})
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReload}
            className="rounded border border-emerald-200 bg-emerald-50 text-emerald-700 px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-900/40 dark:text-emerald-300 dark:hover:bg-emerald-800/40"
            aria-label="Reload to new version"
          >
            <RotateCcw className="h-4 w-4 mr-1.5" /> Reload
          </button>
          <button
            onClick={() => setShow(false)}
            className="rounded hover:bg-emerald-100 dark:hover:bg-emerald-800/40 p-1.5"
            aria-label="Dismiss"
          >
            <span className="sr-only">Dismiss</span>
            <span className="text-emerald-600 dark:text-emerald-400">✕</span>
          </button>
        </div>
      </div>
    </div>
  );
}
