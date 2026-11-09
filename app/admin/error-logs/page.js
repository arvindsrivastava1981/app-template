"use client";

import { useState, useEffect, useCallback } from "react";
import { Bug, AlertTriangle, RefreshCw, Trash2, Activity } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import { toast } from "@/components/ui/Toaster";

const TYPE_LABELS = {
  INTERNAL: "Internal Error",
  API_ERROR: "API Error",
  VALIDATION: "Validation Error",
  HTTP: "HTTP Error",
};

const TYPE_COLORS = {
  INTERNAL: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  API_ERROR: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  VALIDATION: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  HTTP: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
};

export const dynamic = "force-dynamic";

async function fetchTypeCounts() {
  const r = await fetch(`/api/admin/error-logs/counts`, { headers: { "Content-Type": "application/json" } });
  if (!r.ok) {
    const d = await r.json().catch(() => ({}));
    throw new Error(d.error || "Failed to fetch error log counts.");
  }
  return r.json();
}

async function clearLogs() {
  const r = await fetch(`/api/admin/error-logs`, { method: "DELETE" });
  if (!r.ok) {
    const d = await r.json().catch(() => ({}));
    throw new Error(d.error || "Failed to clear error logs.");
  }
  return r.json();
}

export default function ErrorLogsPage() {
  const [counts, setCounts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await fetchTypeCounts();
      setCounts(d.error_type_counts || []);
      setTotal(d.total || 0);
    } catch (e) {
      toast(e.message || "Failed to load error log counts.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleClear() {
    setClearing(true);
    try {
      const d = await clearLogs();
      toast(d.message || "Error logs cleared successfully.", "success");
      await load();
    } catch (e) {
      toast(e.message || "Failed to clear error logs.", "error");
      setClearing(false);
    }
  }

  function formatNumber(n) {
    return n.toLocaleString();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader icon={Bug} title="Error Logs" subtitle="View recorded server-side errors" />

      <Card className="p-5">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <AlertTriangle className="h-4 w-4" />
                <span>Total: {formatNumber(total)} errors</span>
              </div>
              <button
                onClick={handleClear}
                disabled={clearing}
                className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-60 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-300 dark:hover:bg-red-900/30"
              >
                <Trash2 className="h-4 w-4" />
                {clearing ? "Clearing..." : "Clear logs"}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-5 w-5 animate-spin text-zinc-400" />
            </div>
          ) : counts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Activity className="h-10 w-10 text-zinc-400 dark:text-zinc-600" />
              <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">No error logs recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {counts.map((c) => (
                <button
                  key={c.error_type}
                  onClick={() => load()}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700 transition bg-white dark:bg-zinc-900"
                >
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex h-3 w-3 rounded-full ${TYPE_COLORS[c.error_type] || "bg-zinc-400"}`} />
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{TYPE_LABELS[c.error_type] || c.error_type}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{formatNumber(c.count)} error(s)</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">{formatNumber(c.count)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
