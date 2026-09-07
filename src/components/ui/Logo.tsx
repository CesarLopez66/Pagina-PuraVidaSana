import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  // El logo tiene un anillo verde que se funde con fondos oscuros (como el
  // footer, bg-forest). onDark le agrega un respaldo circular claro para
  // que el anillo se distinga del fondo en vez de opacarse.
  onDark?: boolean;
}

const sizes: Record<"sm" | "md" | "lg", { width: number; height: number }> = {
  sm: { width: 52, height: 52 },
  md: { width: 76, height: 76 },
  lg: { width: 116, height: 116 },
};

export function Logo({ size = "md", onDark = false }: LogoProps) {
  const { width, height } = sizes[size];

  return (
    <Link href="/" className="group inline-flex items-center">
      <span
        className={
          onDark
            ? "inline-flex rounded-full bg-white/95 p-1.5 shadow-lg shadow-black/20 ring-1 ring-white/40 transition group-hover:scale-105"
            : "inline-flex transition group-hover:scale-105"
        }
      >
        <Image
          src="/logo.png"
          alt="Casa de Pura Vida Sana"
          width={width}
          height={height}
          className="block"
        />
      </span>
    </Link>
  );
}
