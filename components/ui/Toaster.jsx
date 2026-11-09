"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const ToastCtx = createContext(null);
let idSeq = 1;

export function ToasterProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);
  const push = useCallback((message, kind = "success") => {
    const id = idSeq++;
    setToasts((t) => [...t.slice(-2), { id, message, kind }]);
    setTimeout(() => dismiss(id), 3500);
  }, [dismiss]);
  useEffect(() => {
    const h = (e) => push(e.detail?.message, e.detail?.kind);
    window.addEventListener("kutumb-toast", h);
    return () => window.removeEventListener("kutumb-toast", h);
  }, [push]);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-80 flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} role="status" className={`pointer-events-auto rounded-xl border px-4 py-3 text-sm shadow-lg ${t.kind === "error" ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300" : "border-zinc-200 bg-white text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function toast(message, kind) {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("kutumb-toast", { detail: { message, kind } }));
}

export function useToast() {
  return useContext(ToastCtx);
}