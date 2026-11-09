import Link from "next/link";

export default function PublicNav() {
  return (
    <nav className="flex items-center gap-6 text-sm font-medium">
      <Link href="/login" className="text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400">Sign in</Link>
      <Link href="/register" className="text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400">Signup</Link>
    </nav>
  );
}