"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/Toaster";

const TITLES = {
  login: "Welcome back",
  register: "Create your account",
  requestReset: "Reset password",
  confirmReset: "Set a new password",
};

function Field({ label, type = "text", ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-zinc-600 dark:text-zinc-400">{label}</span>
      <input
        type={type}
        {...props}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-900/50"
      />
    </label>
  );
}

export default function AuthForm({ mode, token = "" }) {
  const [state, setState] = useState({});
  const [pending, setPending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setPending(true);
    setState({});

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      let response;
      switch (mode) {
        case "login":
          response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier: data.identifier, password: data.password }),
          });
          break;
        case "register":
          response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: data.email, password: data.password, full_name: data.full_name }),
          });
          break;
        case "requestReset":
          response = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: data.email }),
          });
          break;
        case "confirmReset":
          response = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: data.token, password: data.password }),
          });
          break;
        default:
          setPending(false);
          return;
      }

      const result = await response.json();

      if (response.ok) {
        if (mode === "login" || mode === "register") {
          window.location.href = "/app";
        } else {
          setState({ ok: true, message: result.message || "Done." });
          toast(result.message || "Done.", "success");
          form.reset();
        }
      } else {
        setState({ error: result.error || "Something went wrong." });
        toast(result.error || "Something went wrong.", "error");
      }
    } catch (err) {
      setState({ error: "Network error. Please try again." });
      toast("Network error. Please try again.", "error");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {state.error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {state.error}
        </div>
      )}
      {mode === "login" && (
        <>
          <Field label="Email or phone" type="text" name="identifier" required />
          <Field label="Password" type="password" name="password" required />
        </>
      )}
      {mode === "register" && (
        <>
          <Field label="Full name" type="text" name="full_name" required />
          <Field label="Email" type="email" name="email" required />
          <Field label="Password" type="password" name="password" minLength={8} required />
        </>
      )}
      {mode === "requestReset" && (
        <Field label="Email" type="email" name="email" required />
      )}
      {mode === "confirmReset" && (
        <>
          <Field label="New password" type="password" name="password" minLength={8} required />
          <input type="hidden" name="token" defaultValue={token} />
        </>
      )}

      <button type="submit" disabled={pending} className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${pending ? "bg-zinc-400 text-zinc-200" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        {mode === "login" ? "Sign in" : mode === "register" ? "Create account" : mode === "requestReset" ? "Send reset link" : "Reset password"}
      </button>

      {state.ok && !state.error && (
        <div role="status" aria-live="polite" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          {state.message || "Done."}
        </div>
      )}

      {(mode === "login" || mode === "register") && (
        <div className="mt-2">
          <a href="/api/auth/google" className="relative flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-emerald-600">
            <span>Continue with Google</span>
          </a>
        </div>
      )}

      <div className="mt-4 border-t border-zinc-200 pt-4 text-sm dark:border-zinc-800">
        {mode === "login" && (
          <div className="flex flex-col gap-1 text-zinc-600 dark:text-zinc-400">
            <Link href="/register" className="hover:underline">Create an account</Link>
            <Link href="/forgot-password" className="hover:underline">Forgot password?</Link>
          </div>
        )}
        {mode === "register" && (
          <Link href="/login" className="text-zinc-600 hover:underline dark:text-zinc-400">Already have an account? Sign in</Link>
        )}
        {mode !== "login" && mode !== "register" && (
          <Link href="/login" className="text-zinc-600 hover:underline dark:text-zinc-400">Back to sign in</Link>
        )}
      </div>
    </form>
  );
}