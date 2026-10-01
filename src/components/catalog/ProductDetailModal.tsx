"use client";

import { Check, MessageCircle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProductCarousel } from "@/components/catalog/ProductCarousel";
import { productWhatsAppUrl } from "@/lib/format";
import { useStore } from "@/store/useStore";

export function ProductDetailModal() {
  const selectedProductId = useStore((s) => s.selectedProductId);
  const setSelectedProduct = useStore((s) => s.setSelectedProduct);
  const whatsapp = useStore((s) => s.storeInfo.whatsapp);
  const product = useStore((s) =>
    selectedProductId ? s.getProduct(selectedProductId) : undefined
  );

  if (!product) return null;

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  return (
    <Modal
      open
      onClose={() => setSelectedProduct(null)}
      title={product.name}
      size="xl"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <ProductCarousel images={images} alt={product.name} />

        <div className="flex flex-col">
          <p className="text-xs font-medium uppercase tracking-wide text-leaf">
            {product.category}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {product.featured && <Badge variant="gold-soft">Destacado</Badge>}
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {product.tags.map((t) => (
                <Badge
                  key={t}
                  className="border-forest/10 bg-soft text-forest/70"
                >
                  {t}
                </Badge>
              ))}
            </div>
          )}

          <p className="mt-4 text-sm leading-relaxed text-ink/60">
            {product.description}
          </p>

          {product.benefits && product.benefits.length > 0 && (
            <ul className="mt-4 space-y-2">
              {product.benefits.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-sm text-ink/70"
                >
                  <Check size={16} className="mt-0.5 shrink-0 text-leaf" />
                  {b}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-auto pt-6">
            <a
              href={productWhatsAppUrl(whatsapp, product.name)}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="secondary" className="w-full">
                <MessageCircle size={16} />
                Consultar por WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
}
