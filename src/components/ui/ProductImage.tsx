"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useState } from "react";

// Imagen de producto con respaldo: si la URL falta o no carga, muestra un
// ícono en lugar del ícono roto del navegador con el texto alternativo.
export function ProductImage({
  src,
  alt,
  sizes,
  className = "object-cover",
  compact = false,
}: {
  src?: string;
  alt: string;
  sizes: string;
  className?: string;
  compact?: boolean;
}) {
  // Se guarda la URL que falló (no un booleano) para que, al cambiar de
  // imagen en el carrusel, la nueva vuelva a intentarse.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-soft text-forest/30"
      >
        <ImageOff size={compact ? 24 : 40} strokeWidth={1.5} />
        {!compact && (
          <span className="text-sm font-medium text-forest/40">
            Imagen no disponible
          </span>
        )}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      unoptimized
      onError={() => setFailedSrc(src)}
    />
  );
}
