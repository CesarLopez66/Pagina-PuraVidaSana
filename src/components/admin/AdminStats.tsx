"use client";

import { Gift, Package, ShoppingBag } from "lucide-react";
import { useStore } from "@/store/useStore";

export function AdminStats() {
  const orders = useStore((s) => s.orders);
  const products = useStore((s) => s.products);
  const wheelLeads = useStore((s) => s.wheelLeads);

  const pendingOrders = orders.filter((o) => o.status === "Pendiente").length;

  const stats = [
    {
      label: "Pedidos pendientes",
      value: pendingOrders,
      icon: ShoppingBag,
      accent: pendingOrders > 0 ? "text-amber-600" : "text-forest",
    },
    {
      label: "Productos en catálogo",
      value: products.length,
      icon: Package,
      accent: "text-forest",
    },
    {
      label: "Leads de la ruleta",
      value: wheelLeads.length,
      icon: Gift,
      accent: "text-forest",
    },
  ];

  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-3">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className="flex items-center gap-3 rounded-2xl border border-forest/10 bg-white p-4 shadow-sm"
          >
            <span className={`flex h-11 w-11 items-center justify-center rounded-full bg-soft ${s.accent}`}>
              <Icon size={20} />
            </span>
            <div>
              <p className={`text-2xl font-bold ${s.accent}`}>{s.value}</p>
              <p className="text-xs text-ink/60">{s.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
