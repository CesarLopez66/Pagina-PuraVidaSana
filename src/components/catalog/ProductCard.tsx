"use client";

import Image from "next/image";
import { MessageCircle } from "lucide-react";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { productWhatsAppUrl } from "@/lib/format";
import { useStore } from "@/store/useStore";

export function ProductCard({
  product,
  variant = "glass",
}: {
  product: Product;
  variant?: "glass" | "solid";
}) {
  const setSelectedProduct = useStore((s) => s.setSelectedProduct);
  const whatsapp = useStore((s) => s.storeInfo.whatsapp);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => setSelectedProduct(product.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter") setSelectedProduct(product.id);
      }}
      className={`group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:shadow-xl hover:shadow-forest/15 ${
        variant === "glass"
          ? "glass-panel"
          : "border border-forest/10 bg-white shadow-sm"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-soft">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width:768px) 100vw, 25vw"
          unoptimized
        />
        {product.featured && (
          <div className="absolute right-3 top-3">
            <Badge variant="gold-soft">Destacado</Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm font-medium uppercase tracking-wide text-leaf">
          {product.category}
        </p>
        <h3 className="mt-1.5 line-clamp-2 text-lg font-semibold text-forest">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-base text-ink/60">
          {product.description}
        </p>
        {product.tags && product.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.tags.slice(0, 2).map((t) => (
              <Badge
                key={t}
                className="border-forest/10 bg-soft text-forest/70"
              >
                {t}
              </Badge>
            ))}
          </div>
        )}
        <div className="mt-5">
          <a
            href={productWhatsAppUrl(whatsapp, product.name)}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <Button size="sm" variant="secondary" className="w-full">
              <MessageCircle size={16} />
              Consultar por WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </article>
  );
}
