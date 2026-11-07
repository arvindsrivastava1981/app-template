import AuthForm from "@/components/auth/AuthForm";
import AuthShell from "@/components/auth/AuthShell";

export const dynamic = "error";

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your account"
      showPrivacy={true}
    >
      <AuthForm mode="login" />
    </AuthShell>
  );
}