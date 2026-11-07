import { cn } from "@/components/ui/utils";

export default function PageHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-8 flex items-center gap-3">
      {Icon && <Icon className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>}
      </div>
    </div>
  );
}