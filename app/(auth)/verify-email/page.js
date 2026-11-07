import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import { VerifyEmailFromUrl } from "@/components/auth/TokenAuthClient";

export const dynamic = "error";

export default function VerifyEmailPage() {
  return (
    <AuthShell>
      <Suspense fallback={<p role="status">Loading email verification…</p>}>
        <VerifyEmailFromUrl />
      </Suspense>
    </AuthShell>
  );
}