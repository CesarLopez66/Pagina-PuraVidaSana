import type { ReactNode } from "react";

type BadgeVariant = "custom" | "gold-soft";

const variantClasses: Record<Exclude<BadgeVariant, "custom">, string> = {
  "gold-soft": "border-gold/25 bg-amber-50 text-amber-700",
};

export function Badge({
  children,
  className = "",
  variant = "custom",
}: {
  children: ReactNode;
  className?: string;
  variant?: BadgeVariant;
}) {
  const preset = variant === "custom" ? "" : variantClasses[variant];
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-sm font-medium ${preset} ${className}`}
    >
      {children}
    </span>
  );
}
