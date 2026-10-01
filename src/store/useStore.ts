import { create } from "zustand";
import { persist } from "zustand/middleware";
import mockData from "@/data/mockData.json";
import type {
  Branch,
  CartItem,
  Order,
  OrderStatus,
  Product,
  ShippingInfo,
  SiteContent,
  StoreInfo,
  WheelLead,
} from "@/types";
import { defaultSiteContent, mergeSiteContent } from "@/lib/site-content";
import { WHEEL_PRIZES, type WheelPrize } from "@/lib/wheel";

interface StoreState {
  products: Product[];
  productsLoading: boolean;
  productsError: string | null;
  cart: CartItem[];
  lastOrder: Order | null;
  orders: Order[];
  storeInfo: StoreInfo;
  siteContent: SiteContent;
  wheelPrizes: WheelPrize[];
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  selectedProductId: string | null;
  wheelLeads: WheelLead[];
  hasPlayedWheel: boolean;
  wheelEnabled: boolean;
  isWheelOpen: boolean;
  searchQuery: string;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  siteContentReady: boolean;
  setSearchQuery: (query: string) => void;
  setCartOpen: (open: boolean) => void;
  setCheckoutOpen: (open: boolean) => void;
  setSelectedProduct: (id: string | null) => void;
  setWheelOpen: (open: boolean) => void;
  addWheelLead: (lead: Omit<WheelLead, "id" | "createdAt">) => WheelLead;
  deleteWheelLead: (id: string) => void;
  setWheelEnabled: (enabled: boolean) => void;
  resetWheelPlayed: () => void;
  clearMyPersonalData: () => void;
  updateStoreInfo: (updates: Partial<StoreInfo>) => void;
  updateSiteContent: (content: SiteContent) => Promise<{ ok: boolean; message?: string }>;
  fetchSiteContent: () => Promise<void>;
  updateWheelPrizes: (prizes: WheelPrize[]) => void;
  deleteOrder: (id: string) => void;
  addToCart: (productId: string, quantity?: number) => { ok: boolean; message?: string };
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => { ok: boolean; message?: string };
  clearCart: () => void;
  getCartCount: () => number;
  getCartSubtotal: () => number;
  getProduct: (id: string) => Product | undefined;
  fetchProducts: () => Promise<void>;
  addProduct: (
    product: Omit<Product, "id">
  ) => Promise<{ ok: boolean; message?: string; product?: Product }>;
  updateProduct: (
    id: string,
    updates: Partial<Product>
  ) => Promise<{ ok: boolean; message?: string; product?: Product }>;
  deleteProduct: (id: string) => Promise<{ ok: boolean; message?: string }>;
  confirmOrder: (shipping: ShippingInfo) => Order;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

const initialStoreInfo: StoreInfo = {
  name: mockData.storeInfo.name,
  tagline: mockData.storeInfo.tagline,
  phone: mockData.storeInfo.phone,
  whatsapp: mockData.storeInfo.whatsapp,
  email: mockData.storeInfo.email,
  branches: mockData.storeInfo.branches as Branch[],
  instagram: "",
  facebook: "",
  tiktok: "",
  shippingFee: 0,
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      products: [],
      productsLoading: false,
      productsError: null,
      cart: [],
      lastOrder: null,
      orders: [],
      storeInfo: initialStoreInfo,
      siteContent: defaultSiteContent,
      wheelPrizes: WHEEL_PRIZES,
      isCartOpen: false,
      isCheckoutOpen: false,
      selectedProductId: null,
      wheelLeads: [],
      hasPlayedWheel: false,
      wheelEnabled: true,
      isWheelOpen: false,
      searchQuery: "",
      hydrated: false,
      siteContentReady: false,

      setHydrated: (value) => set({ hydrated: value }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setCartOpen: (open) => set({ isCartOpen: open }),
      setCheckoutOpen: (open) => set({ isCheckoutOpen: open }),
      setSelectedProduct: (id) => set({ selectedProductId: id }),
      setWheelOpen: (open) => set({ isWheelOpen: open }),
      updateStoreInfo: (updates) =>
        set((state) => ({ storeInfo: { ...state.storeInfo, ...updates } })),
      updateSiteContent: async (content) => {
        const merged = mergeSiteContent(content);
        set({ siteContent: merged });
        try {
          const res = await fetch("/api/site-content", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(merged),
          });
          if (!res.ok) {
            return {
              ok: false,
              message:
                res.status === 401
                  ? "Tu sesión de administrador expiró. Vuelve a iniciar sesión."
                  : "No se pudo guardar en el servidor.",
            };
          }
          return { ok: true };
        } catch {
          return { ok: false, message: "No se pudo conectar con el servidor." };
        }
      },
      fetchSiteContent: async () => {
        try {
          const res = await fetch("/api/site-content", { cache: "no-store" });
          const data = await res.json();
          if (data.ok && data.content) {
            set({ siteContent: mergeSiteContent(data.content) });
          }
        } catch {
          // Sin servidor se mantiene la copia guardada en el navegador.
        } finally {
          set({ siteContentReady: true });
        }
      },
      updateWheelPrizes: (prizes) => set({ wheelPrizes: prizes }),
      setWheelEnabled: (enabled) => set({ wheelEnabled: enabled }),
      resetWheelPlayed: () => set({ hasPlayedWheel: false }),

      // Autoservicio de "derecho al olvido": borra del navegador actual
      // todo lo que identifica a esta persona (carrito, historial de
      // pedidos, participación en la ruleta y sus leads). No toca
      // catálogo ni configuración del negocio, que no son datos
      // personales del visitante. No puede borrar mensajes ya enviados
      // por WhatsApp: eso vive fuera de este sitio.
      clearMyPersonalData: () =>
        set({
          cart: [],
          orders: [],
          lastOrder: null,
          wheelLeads: [],
          hasPlayedWheel: false,
        }),

      deleteWheelLead: (id) =>
        set((state) => ({
          wheelLeads: state.wheelLeads.filter((l) => l.id !== id),
        })),

      deleteOrder: (id) =>
        set((state) => ({
          orders: state.orders.filter((o) => o.id !== id),
        })),

      addWheelLead: (lead) => {
        const newLead: WheelLead = {
          ...lead,
          id: `WL-${Date.now().toString(36).toUpperCase()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          wheelLeads: [newLead, ...state.wheelLeads],
          hasPlayedWheel: true,
        }));
        return newLead;
      },

      getProduct: (id) => get().products.find((p) => p.id === id),

      fetchProducts: async () => {
        set({ productsLoading: true, productsError: null });
        try {
          const res = await fetch("/api/products");
          const data = await res.json();
          if (!res.ok || !data.ok) {
            throw new Error(data.message ?? "No se pudo cargar el catálogo.");
          }
          set({ products: data.products, productsLoading: false });
        } catch (err) {
          set({
            productsLoading: false,
            productsError:
              err instanceof Error ? err.message : "No se pudo cargar el catálogo.",
          });
        }
      },

      getCartCount: () =>
        get().cart.reduce((sum, item) => sum + item.quantity, 0),

      getCartSubtotal: () => {
        const { cart, products } = get();
        return cart.reduce((sum, item) => {
          const product = products.find((p) => p.id === item.productId);
          return sum + (product ? product.price * item.quantity : 0);
        }, 0);
      },

      addToCart: (productId, quantity = 1) => {
        const product = get().products.find((p) => p.id === productId);
        if (!product) return { ok: false, message: "Producto no encontrado." };
        if (product.stock <= 0) return { ok: false, message: "Producto agotado." };

        const existing = get().cart.find((c) => c.productId === productId);
        const nextQty = (existing?.quantity ?? 0) + quantity;

        if (nextQty > product.stock) {
          return {
            ok: false,
            message: `Solo hay ${product.stock} unidades disponibles.`,
          };
        }

        set((state) => ({
          cart: existing
            ? state.cart.map((c) =>
                c.productId === productId ? { ...c, quantity: nextQty } : c
              )
            : [...state.cart, { productId, quantity }],
          isCartOpen: true,
        }));

        return { ok: true };
      },

      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((c) => c.productId !== productId),
        })),

      updateCartQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return { ok: true };
        }

        const product = get().products.find((p) => p.id === productId);
        if (!product) return { ok: false, message: "Producto no encontrado." };
        if (quantity > product.stock) {
          return {
            ok: false,
            message: `Stock máximo: ${product.stock} unidades.`,
          };
        }

        set((state) => ({
          cart: state.cart.map((c) =>
            c.productId === productId ? { ...c, quantity } : c
          ),
        }));
        return { ok: true };
      },

      clearCart: () => set({ cart: [] }),

      addProduct: async (product) => {
        try {
          const res = await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
          });
          const data = await res.json();
          if (!res.ok || !data.ok) {
            return { ok: false, message: data.message ?? "No se pudo crear el producto." };
          }
          set((state) => ({ products: [data.product, ...state.products] }));
          return { ok: true, product: data.product };
        } catch {
          return { ok: false, message: "No se pudo crear el producto." };
        }
      },

      updateProduct: async (id, updates) => {
        try {
          const res = await fetch(`/api/admin/products/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
          });
          const data = await res.json();
          if (!res.ok || !data.ok) {
            return { ok: false, message: data.message ?? "No se pudo guardar el producto." };
          }
          set((state) => ({
            products: state.products.map((p) => (p.id === id ? data.product : p)),
            cart: state.cart
              .map((item) => {
                if (item.productId !== id) return item;
                const nextStock = data.product.stock;
                if (nextStock <= 0) return null;
                return { ...item, quantity: Math.min(item.quantity, nextStock) };
              })
              .filter(Boolean) as CartItem[],
          }));
          return { ok: true, product: data.product };
        } catch {
          return { ok: false, message: "No se pudo guardar el producto." };
        }
      },

      deleteProduct: async (id) => {
        try {
          const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
          const data = await res.json();
          if (!res.ok || !data.ok) {
            return { ok: false, message: data.message ?? "No se pudo eliminar el producto." };
          }
          set((state) => ({
            products: state.products.filter((p) => p.id !== id),
            cart: state.cart.filter((c) => c.productId !== id),
          }));
          return { ok: true };
        } catch {
          return { ok: false, message: "No se pudo eliminar el producto." };
        }
      },

      confirmOrder: (shipping) => {
        const { cart, getCartSubtotal, storeInfo } = get();
        const subtotal = getCartSubtotal();
        const shippingFee = storeInfo.shippingFee;
        const total = subtotal + shippingFee;
        const order: Order = {
          id: `ORD-${Date.now().toString(36).toUpperCase()}`,
          items: [...cart],
          shipping,
          total,
          shippingFee,
          paymentMethod: "whatsapp",
          status: "Pendiente",
          createdAt: new Date().toISOString(),
        };

        // El stock NO se descuenta automáticamente: el pedido solo
        // redirige a WhatsApp para que el dueño confirme la venta.
        // El pedido queda registrado en /admin para que el dueño lo
        // revise y sea él quien ajuste el stock manualmente.
        set((state) => ({
          cart: [],
          lastOrder: order,
          orders: [order, ...state.orders],
          isCartOpen: false,
          isCheckoutOpen: false,
        }));

        return order;
      },

      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
          lastOrder:
            state.lastOrder?.id === id
              ? { ...state.lastOrder, status }
              : state.lastOrder,
        })),

    }),
    {
      name: "pura-vida-sana-store-v2",
      partialize: (state) => ({
        cart: state.cart,
        lastOrder: state.lastOrder,
        orders: state.orders,
        storeInfo: state.storeInfo,
        siteContent: state.siteContent,
        wheelPrizes: state.wheelPrizes,
        wheelLeads: state.wheelLeads,
        hasPlayedWheel: state.hasPlayedWheel,
        wheelEnabled: state.wheelEnabled,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        // Migración: versiones anteriores guardaban una sola ubicación como
        // address/hours/lat/lon sueltos en storeInfo, en vez de un arreglo
        // de sucursales. Si lo persistido no trae `branches`, lo
        // reconstruimos a partir de esos campos viejos (si existen) para no
        // perder una dirección ya editada por el dueño, o si no, caemos al
        // storeInfo inicial.
        const legacy = state.storeInfo as StoreInfo & {
          address?: string;
          hours?: string;
          lat?: number;
          lon?: number;
        };
        if (!Array.isArray(legacy.branches) || legacy.branches.length === 0) {
          state.storeInfo = {
            ...state.storeInfo,
            branches: legacy.address
              ? [
                  {
                    id: "sopocachi",
                    name: state.storeInfo.name || initialStoreInfo.name,
                    address: legacy.address,
                    phone: state.storeInfo.phone,
                    hours: legacy.hours ?? "",
                    lat: legacy.lat ?? initialStoreInfo.branches[0].lat,
                    lon: legacy.lon ?? initialStoreInfo.branches[0].lon,
                  },
                ]
              : initialStoreInfo.branches,
          };
        }

        state.siteContent = mergeSiteContent(state.siteContent);
        state.setHydrated(true);
      },
    }
  )
);
