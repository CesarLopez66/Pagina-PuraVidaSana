"use client";

import { useEffect } from "react";
import { FontTheme } from "@/components/providers/FontTheme";
import { useStore } from "@/store/useStore";

export function StoreHydration({ children }: { children: React.ReactNode }) {
  const setHydrated = useStore((s) => s.setHydrated);
  const fetchProducts = useStore((s) => s.fetchProducts);
  const fetchSiteContent = useStore((s) => s.fetchSiteContent);
  const fetchStoreSettings = useStore((s) => s.fetchStoreSettings);

  useEffect(() => {
    setHydrated(true);
    fetchProducts();
    fetchSiteContent();
    fetchStoreSettings();
  }, [setHydrated, fetchProducts, fetchSiteContent, fetchStoreSettings]);

  return (
    <>
      <FontTheme />
      {children}
    </>
  );
}
