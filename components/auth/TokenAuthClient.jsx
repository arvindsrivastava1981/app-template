"use client";

import { useSearchParams } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import VerifyEmailClient from "@/components/auth/VerifyEmailClient";

export function ResetPasswordFromUrl() {
  const token = useSearchParams().get("token") || "";
  return token ? (
    <AuthForm key={token} mode="confirmReset" token={token} />
  ) : (
    <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
      Invalid or missing reset token. Please request a new password reset link.
    </p>
  );
}

export function VerifyEmailFromUrl() {
  const token = useSearchParams().get("token") || "";
  return <VerifyEmailClient key={token} token={token} />;
}