"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { useStore } from "@/store/useStore";

export function FeaturedProducts() {
  const products = useStore((s) => s.products);
  const featured = useMemo(
    () => products.filter((p) => p.featured).slice(0, 4),
    [products]
  );

  if (featured.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
      <Reveal className="glass-panel mb-12 flex flex-col gap-4 rounded-2xl px-7 py-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-script text-2xl text-leaf">Más pedidos</p>
          <h2 className="font-display mt-1 text-4xl font-bold text-forest md:text-5xl">
            Productos destacados
          </h2>
        </div>
        <Link href="/catalogo">
          <Button variant="outline">Ver catálogo completo</Button>
        </Link>
      </Reveal>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((product, i) => (
          <Reveal key={product.id} delay={i * 80} className="h-full">
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
