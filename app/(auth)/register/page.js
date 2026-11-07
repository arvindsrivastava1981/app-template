import AuthForm from "@/components/auth/AuthForm";
import AuthShell from "@/components/auth/AuthShell";

export const dynamic = "error";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Start using the app in under 2 minutes"
    >
      <AuthForm mode="register" />
    </AuthShell>
  );
}