"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export const PAGE_SIZE = 10;

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 py-3">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-lg p-1.5 text-forest disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-40"
        aria-label="Página anterior"
      >
        <ChevronLeft size={18} className="pop-glow hover:text-leaf" />
      </button>
      <span className="text-sm text-ink/60">
        Página {page} de {totalPages}
      </span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-lg p-1.5 text-forest disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-40"
        aria-label="Página siguiente"
      >
        <ChevronRight size={18} className="pop-glow hover:text-leaf" />
      </button>
    </div>
  );
}
