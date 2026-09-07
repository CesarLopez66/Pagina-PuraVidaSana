"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle2, MessageCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  formatBs,
  buildWhatsAppOrderUrl,
  type WhatsAppOrderItem,
} from "@/lib/format";
import { useStore } from "@/store/useStore";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const ordenParam = searchParams.get("orden");
  const lastOrder = useStore((s) => s.lastOrder);
  const products = useStore((s) => s.products);
  const storeInfo = useStore((s) => s.storeInfo);

  // Solo mostramos lastOrder si no se pidió una orden específica por URL,
  // o si la que se pidió coincide. Si no coincide, no la inventamos: no
  // hay forma de recuperar una orden distinta desde este navegador.
  const order = ordenParam && lastOrder?.id !== ordenParam ? null : lastOrder;

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-forest">Sin orden activa</h1>
        <p className="mt-2 text-ink/60">
          No encontramos una compra reciente en este navegador.
        </p>
        <Link href="/catalogo" className="mt-6 inline-block">
          <Button variant="secondary">Ir al catálogo</Button>
        </Link>
      </div>
    );
  }

  const items: WhatsAppOrderItem[] = order.items
    .map((ci) => {
      const product = products.find((p) => p.id === ci.productId);
      return product
        ? { name: product.name, quantity: ci.quantity, price: product.price }
        : null;
    })
    .filter((x): x is WhatsAppOrderItem => x !== null);

  const waUrl = buildWhatsAppOrderUrl(
    storeInfo.whatsapp,
    order.id,
    items,
    order.total,
    order.shippingFee,
    order.shipping
  );

  return (
    <div className="leaf-pattern min-h-[70vh]">
      <div className="mx-auto max-w-xl px-4 py-16 md:px-6">
        <div className="rounded-2xl border border-leaf/30 bg-white p-8 text-center shadow-sm">
          <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-soft text-leaf">
            <CheckCircle2 size={34} />
          </span>
          <p className="font-script text-xl text-leaf">¡Gracias!</p>
          <h1 className="font-display mt-1 text-3xl font-bold text-forest">
            Pedido enviado
          </h1>
          <p className="mt-3 text-sm text-ink/65">
            Orden <span className="font-mono font-semibold">{order.id}</span>
          </p>
          <p className="mt-1 text-2xl font-bold text-forest">
            {formatBs(order.total)}
          </p>
          {order.shippingFee > 0 && (
            <p className="mt-1 text-xs text-ink/50">
              Subtotal {formatBs(order.total - order.shippingFee)} + Envío{" "}
              {formatBs(order.shippingFee)}
            </p>
          )}
          <p className="mt-4 text-sm text-ink/60">
            Envío a {order.shipping.cityZone} · {order.shipping.address}
          </p>
          <p className="mt-4 rounded-xl bg-soft px-4 py-3 text-sm text-forest/80">
            Tu pedido fue registrado. Ningún pago se procesa en esta página —
            nuestro equipo confirmará disponibilidad y la forma de pago
            directamente por WhatsApp.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a href={waUrl} target="_blank" rel="noreferrer">
              <Button variant="secondary" className="w-full sm:w-auto">
                <MessageCircle size={18} />
                Abrir WhatsApp de nuevo
              </Button>
            </a>
            <Link href="/catalogo">
              <Button variant="outline" className="w-full sm:w-auto">
                <ShoppingBag size={18} />
                Seguir comprando
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmacionPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-ink/50">Cargando confirmación...</div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
