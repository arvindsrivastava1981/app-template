export default function Card({ as: Tag = "div", variant = "default", interactive = false, className = "", children, ...rest }) {
  const variants = {
    default: "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900",
    danger: "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30",
    success: "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950",
    warning: "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950",
  };
  return (
    <Tag
      className={`rounded-xl border shadow-sm ${variants[variant] || variants.default} ${interactive ? "transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:hover:border-emerald-700" : ""} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}