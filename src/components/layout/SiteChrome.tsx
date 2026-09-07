"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { ProductDetailModal } from "@/components/catalog/ProductDetailModal";
import { WheelButton } from "@/components/wheel/WheelButton";
import { WheelModal } from "@/components/wheel/WheelModal";

// El panel de administrador tiene su propio header (AdminHeader, en
// admin/layout.tsx) y no necesita carrito, WhatsApp ni ruleta: son
// elementos de la tienda que solo estorban en las tablas de gestión.
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <ProductDetailModal />
      <WhatsAppButton />
      <WheelButton />
      <WheelModal />
    </>
  );
}
