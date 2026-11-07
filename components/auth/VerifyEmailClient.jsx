"use client";

import { useEffect, useState } from "react";
import { toast } from "@/components/ui/Toaster";

export default function VerifyEmailClient({ token }) {
  const [verified, setVerified] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/auth/verify-email?token=${token}`)
      .then((res) => {
        if (res.ok) setVerified(true);
        else setVerified(false);
      })
      .catch(() => setError("Verification failed. Please try again."));
  }, [token]);

  if (error) return <p className="text-center text-sm text-red-600 dark:text-red-400">{error}</p>;
  if (verified === true) return (
    <div className="text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 mx-auto mb-3">
        ✓
      </div>
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Email verified!</h3>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">You can now sign in to your account.</p>
    </div>
  );
  if (verified === false) return (
    <p className="text-center text-sm text-red-600 dark:text-red-400">
      Invalid or expired verification link. Please request a new one.
    </p>
  );
  return (
    <div className="flex items-center justify-center py-4">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-emerald-600" />
    </div>
  );
}