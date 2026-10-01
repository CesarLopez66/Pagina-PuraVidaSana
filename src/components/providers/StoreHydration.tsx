"use client";

import { useEffect } from "react";
import { FontTheme } from "@/components/providers/FontTheme";
import { useStore } from "@/store/useStore";

export function StoreHydration({ children }: { children: React.ReactNode }) {
  const setHydrated = useStore((s) => s.setHydrated);
  const fetchProducts = useStore((s) => s.fetchProducts);
  const fetchSiteContent = useStore((s) => s.fetchSiteContent);

  useEffect(() => {
    setHydrated(true);
    fetchProducts();
    fetchSiteContent();
  }, [setHydrated, fetchProducts, fetchSiteContent]);

  return (
    <>
      <FontTheme />
      {children}
    </>
  );
}
