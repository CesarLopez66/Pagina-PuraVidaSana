"use client";

import { useEffect, useState } from "react";
import {
  ClipboardList,
  Gauge,
  Gift,
  PanelsTopLeft,
  Settings,
  Warehouse,
} from "lucide-react";
import { AdminStats } from "@/components/admin/AdminStats";
import { SiteContentForm } from "@/components/admin/SiteContentForm";
import { StoreSettingsForm } from "@/components/admin/StoreSettingsForm";
import { WheelPrizeSettings } from "@/components/admin/WheelPrizeSettings";
import { WheelStatusSettings } from "@/components/admin/WheelStatusSettings";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { ProductTable } from "@/components/admin/ProductTable";
import { WheelLeadsTable } from "@/components/admin/WheelLeadsTable";
import { formatBs } from "@/lib/format";
import { useStore } from "@/store/useStore";

type TabKey = "resumen" | "pedidos" | "inventario" | "sitio" | "ruleta" | "negocio";

export default function AdminPage() {
  const [tab, setTab] = useState<TabKey>("resumen");

  const orders = useStore((s) => s.orders);
  const products = useStore((s) => s.products);
  const wheelLeads = useStore((s) => s.wheelLeads);
  const fetchAdminData = useStore((s) => s.fetchAdminData);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const pendingOrdersList = orders
    .filter((o) => o.status === "Pendiente")
    .slice(0, 5);
  const recentProducts = products.slice(0, 5);
  const pendingOrders = orders.filter((o) => o.status === "Pendiente").length;
  const wheelLeadsCount = wheelLeads.length;

  const tabs: {
    key: TabKey;
    label: string;
    icon: typeof Gauge;
    count?: number;
  }[] = [
    { key: "resumen", label: "Resumen", icon: Gauge },
    { key: "pedidos", label: "Pedidos", icon: ClipboardList, count: pendingOrders },
    { key: "inventario", label: "Inventario", icon: Warehouse, count: products.length },
    { key: "sitio", label: "Sitio", icon: PanelsTopLeft },
    { key: "ruleta", label: "Ruleta", icon: Gift, count: wheelLeadsCount },
    { key: "negocio", label: "Negocio", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <div className="mb-6">
          <p className="font-script text-xl text-leaf">Gestión local</p>
          <h1 className="font-display mt-1 text-3xl font-bold text-forest md:text-4xl">
            Inventario / Admin
          </h1>
          <p className="mt-2 max-w-2xl text-ink/65">
            Todo lo que guardes aquí se publica en el servidor y lo ven al
            instante todos los visitantes del sitio, desde cualquier
            dispositivo. Los productos se consultan por WhatsApp. El texto
            del inicio y de Nosotros se edita en Sitio.
          </p>
        </div>

        <AdminStats />

        <nav className="mb-6 flex gap-1 overflow-x-auto rounded-2xl border border-forest/10 bg-white p-1.5 shadow-sm">
          {tabs.map(({ key, label, icon: Icon, count }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-forest text-white shadow-sm"
                    : "text-ink/60 hover:bg-soft hover:text-forest"
                }`}
              >
                <Icon size={16} />
                {label}
                {!!count && (
                  <span
                    className={`ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-leaf/15 text-forest"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {tab === "resumen" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-forest">
                  Pedidos pendientes
                </h2>
                <button
                  onClick={() => setTab("pedidos")}
                  className="pop-glow text-sm font-medium text-leaf hover:text-forest"
                >
                  Ver todos →
                </button>
              </div>
              {pendingOrdersList.length === 0 ? (
                <p className="py-6 text-center text-sm text-ink/50">
                  No hay pedidos pendientes. Todo al día.
                </p>
              ) : (
                <ul className="divide-y divide-soft">
                  {pendingOrdersList.map((o) => (
                    <li
                      key={o.id}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-forest">
                          {o.shipping.name}
                        </p>
                        <p className="text-xs text-ink/50">
                          {o.id} ·{" "}
                          {new Date(o.createdAt).toLocaleDateString("es-BO")}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-forest">
                        {formatBs(o.total)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-forest">
                  Productos recientes
                </h2>
                <button
                  onClick={() => setTab("inventario")}
                  className="pop-glow text-sm font-medium text-leaf hover:text-forest"
                >
                  Ver todos →
                </button>
              </div>
              {recentProducts.length === 0 ? (
                <p className="py-6 text-center text-sm text-ink/50">
                  Todavía no hay productos en el catálogo.
                </p>
              ) : (
                <ul className="divide-y divide-soft">
                  {recentProducts.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-forest">
                          {p.name}
                        </p>
                        <p className="text-xs text-ink/50">{p.category}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}

        {tab === "pedidos" && (
          <section>
            <h2 className="font-display mb-4 text-2xl font-bold text-forest">
              Pedidos por WhatsApp
            </h2>
            <p className="mb-4 text-sm text-ink/60">
              Si un cliente solicita que elimines sus datos (derecho de
              eliminación, ver Términos y Privacidad), borra su pedido aquí.
            </p>
            <OrdersTable />
          </section>
        )}

        {tab === "inventario" && (
          <section>
            <h2 className="font-display mb-4 text-2xl font-bold text-forest">
              Inventario
            </h2>
            <ProductTable />
          </section>
        )}

        {tab === "sitio" && (
          <section>
            <h2 className="font-display mb-4 text-2xl font-bold text-forest">
              Contenido del sitio
            </h2>
            <p className="mb-4 text-sm text-ink/60">
              Cambia la tipografía, el navbar, la imagen y los textos de la
              pantalla principal, y el contenido de la página Nosotros. Al
              guardar, los cambios se publican para todos los visitantes.
            </p>
            <SiteContentForm />
          </section>
        )}

        {tab === "ruleta" && (
          <div className="space-y-10">
            <section>
              <h2 className="font-display mb-4 text-2xl font-bold text-forest">
                Estado de la ruleta
              </h2>
              <WheelStatusSettings />
            </section>
            <section>
              <h2 className="font-display mb-4 text-2xl font-bold text-forest">
                Configuración de la ruleta
              </h2>
              <WheelPrizeSettings />
            </section>
            <section>
              <h2 className="font-display mb-4 text-2xl font-bold text-forest">
                Leads de la ruleta de descuento
              </h2>
              <p className="mb-4 text-sm text-ink/60">
                Si un participante solicita que elimines sus datos (derecho de
                eliminación, ver Términos y Privacidad), borra su lead aquí.
              </p>
              <WheelLeadsTable />
            </section>
          </div>
        )}

        {tab === "negocio" && (
          <section>
            <h2 className="font-display mb-4 text-2xl font-bold text-forest">
              Configuración del negocio
            </h2>
            <p className="mb-4 text-sm text-ink/60">
              Estos datos se usan en todo el sitio (Footer, botón de
              WhatsApp, sucursal, checkout). Los cambios se reflejan de
              inmediato, sin necesidad de tocar código.
            </p>
            <StoreSettingsForm />
          </section>
        )}
      </div>
    </div>
  );
}
