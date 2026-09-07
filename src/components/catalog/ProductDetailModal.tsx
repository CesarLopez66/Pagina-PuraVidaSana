"use client";

import { useState } from "react";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProductCarousel } from "@/components/catalog/ProductCarousel";
import { formatBs, getStockStatus, stockStatusClasses } from "@/lib/format";
import { useStore } from "@/store/useStore";

export function ProductDetailModal() {
  const selectedProductId = useStore((s) => s.selectedProductId);
  const setSelectedProduct = useStore((s) => s.setSelectedProduct);
  const product = useStore((s) =>
    selectedProductId ? s.getProduct(selectedProductId) : undefined
  );
  const addToCart = useStore((s) => s.addToCart);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const [lastProductId, setLastProductId] = useState(selectedProductId);

  if (selectedProductId !== lastProductId) {
    setLastProductId(selectedProductId);
    setQty(1);
    setMessage(null);
  }

  if (!product) return null;

  const status = getStockStatus(product.stock);
  const disabled = product.stock <= 0;
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  const handleAdd = () => {
    const result = addToCart(product.id, qty);
    if (!result.ok && result.message) {
      setMessage(result.message);
      return;
    }
    setSelectedProduct(null);
  };

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
            <Badge className={stockStatusClasses(status)}>{status}</Badge>
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

          <p className="mt-4 text-2xl font-bold text-forest">
            {formatBs(product.price)}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink/60">
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

          <div className="mt-auto flex items-center gap-3 pt-6">
            <div className="flex items-center rounded-xl border border-forest/15">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="p-2.5 text-forest"
                aria-label="Reducir cantidad"
              >
                <Minus size={14} className="pop-glow hover:text-leaf" />
              </button>
              <span className="w-8 text-center text-sm font-semibold">
                {qty}
              </span>
              <button
                type="button"
                onClick={() =>
                  setQty((q) => Math.min(product.stock, q + 1))
                }
                className="p-2.5 text-forest"
                aria-label="Aumentar cantidad"
              >
                <Plus size={14} className="pop-glow hover:text-leaf" />
              </button>
            </div>
            <Button
              variant={disabled ? "outline" : "secondary"}
              disabled={disabled}
              onClick={handleAdd}
              className="flex-1"
            >
              <ShoppingCart size={16} />
              {disabled ? "Agotado" : "Añadir al carrito"}
            </Button>
          </div>
          {message && (
            <p className="mt-2 text-xs text-amber-700">{message}</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
