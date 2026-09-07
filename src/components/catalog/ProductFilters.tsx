"use client";

import type { Category } from "@/types";

const categories: Array<Category | "Todas"> = [
  "Todas",
  "Suplementos",
  "Vitaminas",
  "Cosmética Natural",
  "Proteínas",
];

interface ProductFiltersProps {
  category: Category | "Todas";
  onCategoryChange: (c: Category | "Todas") => void;
  minPrice: number;
  maxPrice: number;
  onMinPriceChange: (n: number) => void;
  onMaxPriceChange: (n: number) => void;
  search: string;
  onSearchChange: (s: string) => void;
  priceCeiling: number;
}

export function ProductFilters({
  category,
  onCategoryChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  search,
  onSearchChange,
  priceCeiling,
}: ProductFiltersProps) {
  return (
    <div className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm md:p-6">
      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-forest/70">
            Buscar
          </label>
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Nombre o descripción..."
            className="w-full rounded-xl border border-forest/15 bg-white/70 px-3.5 py-3 text-base outline-none focus:border-leaf focus:ring-2 focus:ring-leaf/20"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-forest/70">
            Categoría
          </label>
          <select
            value={category}
            onChange={(e) =>
              onCategoryChange(e.target.value as Category | "Todas")
            }
            className="w-full rounded-xl border border-forest/15 bg-white/70 px-3.5 py-3 text-base outline-none focus:border-leaf"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-forest/70">
            Rango de precio (Bs.)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={priceCeiling}
              value={minPrice}
              onChange={(e) => onMinPriceChange(Number(e.target.value) || 0)}
              className="w-full rounded-xl border border-forest/15 bg-white/70 px-3.5 py-3 text-base outline-none focus:border-leaf"
              placeholder="Mín"
            />
            <span className="text-ink/40">–</span>
            <input
              type="number"
              min={0}
              max={priceCeiling}
              value={maxPrice}
              onChange={(e) =>
                onMaxPriceChange(Number(e.target.value) || priceCeiling)
              }
              className="w-full rounded-xl border border-forest/15 bg-white/70 px-3.5 py-3 text-base outline-none focus:border-leaf"
              placeholder="Máx"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
