"use client";

import { ProductImage } from "@/components/ui/ProductImage";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/store/useStore";
import { formatBs } from "@/lib/format";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";

export function CartDrawer() {
  const isCartOpen = useStore((s) => s.isCartOpen);
  const setCartOpen = useStore((s) => s.setCartOpen);
  const cart = useStore((s) => s.cart);
  const products = useStore((s) => s.products);
  const updateCartQuantity = useStore((s) => s.updateCartQuantity);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const getCartSubtotal = useStore((s) => s.getCartSubtotal);
  const setCheckoutOpen = useStore((s) => s.setCheckoutOpen);
  const [toast, setToast] = useState<string | null>(null);

  const subtotal = getCartSubtotal();

  const changeQty = (productId: string, quantity: number) => {
    const result = updateCartQuantity(productId, quantity);
    if (!result.ok && result.message) {
      setToast(result.message);
      setTimeout(() => setToast(null), 2500);
    }
  };

  return (
    <>
      {isCartOpen && (
        <div className="fixed inset-0 z-[60]">
          <button
            aria-label="Cerrar carrito"
            className="absolute inset-0 bg-ink/45 animate-backdrop-in"
            onClick={() => setCartOpen(false)}
          />
          <aside className="glass-panel absolute right-0 top-0 flex h-full w-full max-w-md flex-col shadow-2xl animate-drawer-in">
            <div className="flex items-center justify-between border-b border-white/40 px-5 py-4">
              <h2 className="text-lg font-semibold text-forest">Tu carrito</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="rounded-lg p-2"
                aria-label="Cerrar"
              >
                <X size={18} className="pop-glow hover:text-leaf" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-ink/60">
                  <p className="text-sm">Tu carrito está vacío.</p>
                  <Button
                    className="mt-4"
                    variant="secondary"
                    onClick={() => setCartOpen(false)}
                  >
                    Seguir comprando
                  </Button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {cart.map((item) => {
                    const product = products.find(
                      (p) => p.id === item.productId
                    );
                    if (!product) return null;
                    return (
                      <li
                        key={item.productId}
                        className="flex gap-3 border-b border-soft pb-4"
                      >
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-soft">
                          <ProductImage
                            src={product.image}
                            alt={product.name}
                            sizes="80px"
                            compact
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="truncate text-sm font-semibold text-forest">
                                {product.name}
                              </p>
                              <p className="text-xs text-ink/50">
                                Stock máx: {product.stock}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="rounded p-1 text-ink/40"
                              aria-label="Eliminar"
                            >
                              <Trash2 size={14} className="pop-glow hover:text-red-500" />
                            </button>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="inline-flex items-center rounded-lg border border-forest/15">
                              <button
                                className="p-1.5 active:scale-90"
                                onClick={() =>
                                  changeQty(item.productId, item.quantity - 1)
                                }
                                aria-label="Disminuir"
                              >
                                <Minus size={14} className="pop-glow hover:text-leaf" />
                              </button>
                              <span className="min-w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                className="p-1.5 active:scale-90"
                                onClick={() =>
                                  changeQty(item.productId, item.quantity + 1)
                                }
                                aria-label="Aumentar"
                              >
                                <Plus size={14} className="pop-glow hover:text-leaf" />
                              </button>
                            </div>
                            <p className="text-sm font-semibold text-forest">
                              {formatBs(product.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-white/40 bg-white/80 px-5 py-4">
                {toast && (
                  <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    {toast}
                  </p>
                )}
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-ink/60">Subtotal</span>
                  <span className="font-medium">{formatBs(subtotal)}</span>
                </div>
                <div className="mb-4 flex justify-between text-base">
                  <span className="font-semibold text-forest">Total</span>
                  <span className="font-bold text-forest">
                    {formatBs(subtotal)}
                  </span>
                </div>
                <Button
                  variant="secondary"
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    setCartOpen(false);
                    setCheckoutOpen(true);
                  }}
                >
                  Continuar pedido
                </Button>
              </div>
            )}
          </aside>
        </div>
      )}
      <CheckoutModal />
    </>
  );
}
