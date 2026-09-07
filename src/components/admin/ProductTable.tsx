"use client";

import { useMemo, useState } from "react";
import { FileSpreadsheet, Pencil, Plus, Trash2, Upload } from "lucide-react";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Pagination, PAGE_SIZE } from "@/components/ui/Pagination";
import { formatBs, getStockStatus, stockStatusClasses } from "@/lib/format";
import { useStore } from "@/store/useStore";
import { ProductFormModal } from "@/components/admin/ProductFormModal";
import { BulkImportModal } from "@/components/admin/BulkImportModal";

async function downloadTemplate() {
  const res = await fetch("/api/admin/products/template");
  if (!res.ok) {
    alert("No se pudo descargar la plantilla.");
    return;
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "plantilla-productos.xlsx";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function ProductTable() {
  const products = useStore((s) => s.products);
  const deleteProduct = useStore((s) => s.deleteProduct);
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [products, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Buscar por ID, nombre o categoría..."
          className="w-full max-w-md rounded-xl border border-forest/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-leaf sm:w-auto"
        />
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={downloadTemplate}>
            <FileSpreadsheet size={16} />
            Descargar plantilla
          </Button>
          <Button variant="outline" size="sm" onClick={() => setImporting(true)}>
            <Upload size={16} />
            Importar Excel/CSV
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setCreating(true)}>
            <Plus size={16} />
            Agregar producto
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-forest/10 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-soft text-xs uppercase tracking-wide text-forest/70">
            <tr>
              <th className="px-4 py-3 font-semibold">ID</th>
              <th className="px-4 py-3 font-semibold">Nombre</th>
              <th className="px-4 py-3 font-semibold">Categoría</th>
              <th className="px-4 py-3 font-semibold">Precio</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
              <th className="px-4 py-3 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((product) => {
              const status = getStockStatus(product.stock);
              return (
                <tr
                  key={product.id}
                  className="border-t border-soft hover:bg-surface/80"
                >
                  <td className="px-4 py-3 font-mono text-xs text-ink/60">
                    {product.id}
                  </td>
                  <td className="px-4 py-3 font-medium text-forest">
                    {product.name}
                  </td>
                  <td className="px-4 py-3 text-ink/70">{product.category}</td>
                  <td className="px-4 py-3 font-semibold">
                    {formatBs(product.price)}
                  </td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">
                    <Badge className={stockStatusClasses(status)}>
                      {status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditing(product)}
                        className="rounded-lg p-2 text-forest"
                        aria-label="Editar"
                      >
                        <Pencil size={16} className="pop-glow hover:text-leaf" />
                      </button>
                      <button
                        onClick={async () => {
                          if (
                            confirm(
                              `¿Eliminar "${product.name}" del inventario?`
                            )
                          ) {
                            const result = await deleteProduct(product.id);
                            if (!result.ok) {
                              alert(result.message ?? "No se pudo eliminar el producto.");
                            }
                          }
                        }}
                        className="rounded-lg p-2 text-red-600"
                        aria-label="Eliminar"
                      >
                        <Trash2 size={16} className="pop-glow hover:text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {pageItems.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-ink/50"
                >
                  No hay productos que coincidan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <ProductFormModal
        open={creating}
        onClose={() => setCreating(false)}
        mode="create"
      />
      <ProductFormModal
        open={!!editing}
        onClose={() => setEditing(null)}
        mode="edit"
        product={editing ?? undefined}
      />
      <BulkImportModal open={importing} onClose={() => setImporting(false)} />
    </div>
  );
}
