export default function CardHeader({ icon: Icon, title, children, className = "" }) {
  return (
    <div className={`flex items-center gap-2 mb-2 ${className}`}>
      {Icon && <Icon className="h-4 w-4" />}
      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</span>
    </div>
  );
}