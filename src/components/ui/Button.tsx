import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

// glow: color de la paleta al que vira el texto/ícono en hover. Para
// "secondary" (fondo leaf) no puede ser leaf -el texto se volvería
// invisible sobre su propio fondo-, así que usa gold en su lugar.
const variants: Record<Variant, { base: string; glow: string }> = {
  primary: {
    base: "bg-forest text-white shadow-sm shadow-forest/20",
    glow: "hover:text-leaf",
  },
  secondary: {
    base: "bg-leaf text-white shadow-sm shadow-leaf/25",
    glow: "hover:text-forest",
  },
  ghost: {
    base: "bg-transparent text-forest",
    glow: "hover:text-leaf",
  },
  danger: {
    base: "bg-red-600 text-white",
    glow: "hover:text-red-100",
  },
  outline: {
    base: "border border-forest/25 bg-white text-forest",
    glow: "hover:text-leaf",
  },
};

const sizes: Record<Size, string> = {
  sm: "px-3.5 py-2 text-sm",
  md: "px-5 py-3 text-base",
  lg: "px-7 py-4 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl font-medium active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50 ${variants[variant].base} ${sizes[size]} ${className}`}
      {...props}
    >
      <span className={`pop-glow inline-flex items-center gap-2 ${variants[variant].glow}`}>
        {children}
      </span>
    </button>
  );
}
