"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Download, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Pagination, PAGE_SIZE } from "@/components/ui/Pagination";
import { downloadCsv } from "@/lib/csv";
import { formatBs } from "@/lib/format";
import { useStore } from "@/store/useStore";
import type { OrderStatus } from "@/types";

const statusClasses: Record<OrderStatus, string> = {
  Pendiente: "bg-amber-50 text-amber-800 border-amber-200",
  Confirmado: "bg-leaf/15 text-forest border-leaf/30",
  Cancelado: "bg-red-50 text-red-700 border-red-200",
};

const statusOptions: OrderStatus[] = ["Pendiente", "Confirmado", "Cancelado"];

export function OrdersTable() {
  const orders = useStore((s) => s.orders);
  const products = useStore((s) => s.products);
  const updateOrderStatus = useStore((s) => s.updateOrderStatus);
  const deleteOrder = useStore((s) => s.deleteOrder);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "Todos">("Todos");
  const [page, setPage] = useState(1);

  const overcommitted = useMemo(() => {
    const pendingQtyByProduct = new Map<string, number>();
    for (const order of orders) {
      if (order.status !== "Pendiente") continue;
      for (const item of order.items) {
        pendingQtyByProduct.set(
          item.productId,
          (pendingQtyByProduct.get(item.productId) ?? 0) + item.quantity
        );
      }
    }
    const warnings: { name: string; requested: number; stock: number }[] = [];
    for (const [productId, requested] of pendingQtyByProduct) {
      const product = products.find((p) => p.id === productId);
      if (product && requested > product.stock) {
        warnings.push({ name: product.name, requested, stock: product.stock });
      }
    }
    return warnings;
  }, [orders, products]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return orders.filter((o) => {
      const matchStatus = statusFilter === "Todos" || o.status === statusFilter;
      const matchQuery =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.shipping.name.toLowerCase().includes(q) ||
        o.shipping.phone.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [orders, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const exportCsv = () => {
    downloadCsv(
      "pedidos.csv",
      ["Orden", "Cliente", "Telefono", "Ciudad", "Direccion", "Productos", "Total", "Estado", "Fecha"],
      filtered.map((o) => [
        o.id,
        o.shipping.name,
        o.shipping.phone,
        o.shipping.cityZone,
        o.shipping.address,
        o.items
          .map((ci) => {
            const p = products.find((prod) => prod.id === ci.productId);
            return `${p ? p.name : "Producto eliminado"} x${ci.quantity}`;
          })
          .join(" | "),
        o.total,
        o.status,
        new Date(o.createdAt).toLocaleDateString("es-BO"),
      ])
    );
  };

  return (
    <div className="space-y-4">
      {overcommitted.length > 0 && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">
              Hay pedidos pendientes que suman más que el stock disponible:
            </p>
            <ul className="mt-1 list-disc pl-4">
              {overcommitted.map((w) => (
                <li key={w.name}>
                  {w.name}: pedido {w.requested}, stock {w.stock}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar por nombre, teléfono u orden..."
            className="w-full max-w-xs rounded-xl border border-forest/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-leaf"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as OrderStatus | "Todos");
              setPage(1);
            }}
            className="rounded-xl border border-forest/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-leaf"
          >
            <option value="Todos">Todos los estados</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <Button variant="outline" size="sm" onClick={exportCsv}>
          <Download size={16} />
          Exportar CSV
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-forest/10 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-soft text-xs uppercase tracking-wide text-forest/70">
            <tr>
              <th className="px-4 py-3 font-semibold">Orden</th>
              <th className="px-4 py-3 font-semibold">Cliente</th>
              <th className="px-4 py-3 font-semibold">Entrega</th>
              <th className="px-4 py-3 font-semibold">Productos</th>
              <th className="px-4 py-3 font-semibold">Total</th>
              <th className="px-4 py-3 font-semibold">Fecha</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
              <th className="px-4 py-3 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((order) => {
              const itemsText = order.items
                .map((ci) => {
                  const product = products.find((p) => p.id === ci.productId);
                  return `${product ? product.name : "Producto eliminado"} x${ci.quantity}`;
                })
                .join(", ");

              return (
                <tr
                  key={order.id}
                  className="border-t border-soft align-top hover:bg-surface/80"
                >
                  <td className="px-4 py-3 font-mono text-xs text-ink/60">
                    {order.id}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-forest">
                      {order.shipping.name}
                    </p>
                    <p className="text-xs text-ink/50">{order.shipping.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-ink/70">
                    {order.shipping.cityZone} - {order.shipping.address}
                  </td>
                  <td className="max-w-xs px-4 py-3 text-ink/70">{itemsText}</td>
                  <td className="px-4 py-3 font-semibold text-forest">
                    {formatBs(order.total)}
                  </td>
                  <td className="px-4 py-3 text-ink/50">
                    {new Date(order.createdAt).toLocaleDateString("es-BO")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5">
                      <Badge className={statusClasses[order.status]}>
                        {order.status}
                      </Badge>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value as OrderStatus)
                        }
                        className="rounded-lg border border-forest/15 bg-surface px-2 py-1 text-xs outline-none focus:border-leaf"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar el pedido ${order.id}?`)) {
                          deleteOrder(order.id);
                        }
                      }}
                      className="rounded-lg p-2 text-red-600"
                      aria-label="Eliminar pedido"
                    >
                      <Trash2 size={16} className="pop-glow hover:text-red-500" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-ink/50">
                  {orders.length === 0
                    ? "Aún no hay pedidos registrados."
                    : "No hay pedidos que coincidan."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
