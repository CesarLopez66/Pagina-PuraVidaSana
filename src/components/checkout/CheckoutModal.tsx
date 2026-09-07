"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/store/useStore";
import { formatBs, buildWhatsAppOrderUrl, type WhatsAppOrderItem } from "@/lib/format";
import type { ShippingInfo } from "@/types";

const EMPTY_SHIPPING: ShippingInfo = {
  name: "",
  phone: "",
  cityZone: "",
  address: "",
};

export function CheckoutModal() {
  const open = useStore((s) => s.isCheckoutOpen);
  const setCheckoutOpen = useStore((s) => s.setCheckoutOpen);
  const getCartSubtotal = useStore((s) => s.getCartSubtotal);
  const confirmOrder = useStore((s) => s.confirmOrder);
  const cart = useStore((s) => s.cart);
  const products = useStore((s) => s.products);
  const storeInfo = useStore((s) => s.storeInfo);
  const router = useRouter();

  const [shipping, setShipping] = useState<ShippingInfo>(EMPTY_SHIPPING);
  const [errors, setErrors] = useState<Partial<ShippingInfo>>({});
  const [wasOpen, setWasOpen] = useState(open);

  const subtotal = getCartSubtotal();
  const shippingFee = storeInfo.shippingFee;
  const total = subtotal + shippingFee;

  if (open !== wasOpen) {
    setWasOpen(open);
    if (!open) {
      setShipping(EMPTY_SHIPPING);
      setErrors({});
    }
  }

  const validate = () => {
    const next: Partial<ShippingInfo> = {};
    if (!shipping.name.trim()) next.name = "Ingresa tu nombre";
    if (!shipping.phone.trim() || shipping.phone.trim().length < 7)
      next.phone = "Teléfono inválido";
    if (!shipping.cityZone.trim()) next.cityZone = "Indica ciudad/zona";
    if (!shipping.address.trim()) next.address = "Ingresa tu dirección";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || !validate()) return;

    const order = confirmOrder(shipping);

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

    window.open(waUrl, "_blank");
    setCheckoutOpen(false);
    router.push(`/confirmacion?orden=${order.id}`);
  };

  return (
    <Modal
      open={open}
      onClose={() => setCheckoutOpen(false)}
      title="Datos de envío"
      size="lg"
      variant="solid"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-ink/65">
          Completa tus datos para coordinar la entrega en La Paz o el envío
          nacional. El pago se confirma directamente con nuestro equipo por
          WhatsApp — no se procesa ningún pago en esta página.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Nombre completo"
            error={errors.name}
            value={shipping.name}
            onChange={(v) => setShipping((s) => ({ ...s, name: v }))}
          />
          <Field
            label="Teléfono / WhatsApp"
            error={errors.phone}
            value={shipping.phone}
            onChange={(v) => setShipping((s) => ({ ...s, phone: v }))}
          />
          <Field
            label="Ciudad / Zona de La Paz"
            error={errors.cityZone}
            value={shipping.cityZone}
            onChange={(v) => setShipping((s) => ({ ...s, cityZone: v }))}
            placeholder="Ej. Sopocachi, El Alto, Calacoto..."
          />
          <Field
            label="Dirección"
            error={errors.address}
            value={shipping.address}
            onChange={(v) => setShipping((s) => ({ ...s, address: v }))}
          />
        </div>

        <div className="rounded-xl border border-leaf/40 bg-soft p-4">
          <p className="flex items-center gap-2 font-semibold text-forest">
            <MessageCircle size={18} className="text-leaf" />
            Confirmación y pago por WhatsApp
          </p>
          <p className="mt-1 text-sm text-ink/60">
            Al enviar tu pedido, se abrirá WhatsApp con el detalle de tus
            productos para que nuestro equipo confirme disponibilidad y
            coordine la forma de pago contigo.
          </p>
        </div>

        <p className="text-xs text-ink/50">
          Al enviar este formulario, tus datos de contacto y entrega se
          comparten por WhatsApp para procesar tu pedido, según nuestros{" "}
          <Link
            href="/terminos"
            target="_blank"
            className="underline hover:text-forest"
          >
            Términos y Política de Privacidad
          </Link>
          .
        </p>

        <div className="border-t border-soft pt-4">
          {shippingFee > 0 && (
            <div className="mb-2 space-y-1 text-sm text-ink/60">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatBs(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span>{formatBs(shippingFee)}</span>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <p className="text-sm text-ink/60">
              Total estimado:{" "}
              <span className="text-lg font-bold text-forest">
                {formatBs(total)}
              </span>
            </p>
            <Button type="submit" variant="secondary" size="lg">
              <MessageCircle size={18} />
              Enviar pedido por WhatsApp
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-forest/70">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-surface px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-leaf/20 ${
          error
            ? "border-red-300 focus:border-red-400"
            : "border-forest/15 focus:border-leaf"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
