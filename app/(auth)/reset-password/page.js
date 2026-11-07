import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import { ResetPasswordFromUrl } from "@/components/auth/TokenAuthClient";

export const dynamic = "error";

export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <Suspense fallback={<p role="status">Loading password reset…</p>}>
        <ResetPasswordFromUrl />
      </Suspense>
    </AuthShell>
  );
}