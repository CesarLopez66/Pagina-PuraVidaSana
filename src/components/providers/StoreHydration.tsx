"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

export function StoreHydration({ children }: { children: React.ReactNode }) {
  const setHydrated = useStore((s) => s.setHydrated);
  const fetchProducts = useStore((s) => s.fetchProducts);

  useEffect(() => {
    setHydrated(true);
    fetchProducts();
  }, [setHydrated, fetchProducts]);

  return <>{children}</>;
}
