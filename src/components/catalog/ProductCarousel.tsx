"use client";

import { ProductImage } from "@/components/ui/ProductImage";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export function ProductCarousel({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) return null;

  const go = (delta: number) =>
    setIndex((i) => (i + delta + images.length) % images.length);

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-soft">
      <ProductImage
        src={images[index]}
        alt={alt}
        sizes="(max-width:768px) 100vw, 50vw"
      />
      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Imagen anterior"
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-forest shadow"
          >
            <ChevronLeft size={18} className="pop-glow hover:text-leaf" />
          </button>
          <button
            type="button"
            aria-label="Imagen siguiente"
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-forest shadow"
          >
            <ChevronRight size={18} className="pop-glow hover:text-leaf" />
          </button>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((img, i) => (
              <button
                key={img}
                type="button"
                aria-label={`Ir a imagen ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-4 bg-leaf" : "w-1.5 bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
